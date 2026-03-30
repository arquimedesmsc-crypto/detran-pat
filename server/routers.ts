import { COOKIE_NAME } from "@shared/const";
import { SignJWT, jwtVerify } from "jose";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import {
  addLevantamentoFoto,
  createLevantamentoItem,
  createPatrimonioItem,
  deleteLevantamentoItem,
  getLevantamentoAnual,
  getLevantamentoAnosDisponiveis,
  getLevantamentoFotos,
  getLocaisList,
  getPatrimonioBySetor,
  getPatrimonioItems,
  getPatrimonioKPIs,
  getPatrimonioTimeline,
  getSetoresList,
  invalidatePatrimonioCache,
  loginAppUser,
  marcarLocalizado,
  updateLevantamentoStatus,
} from "./db";
import { storagePut } from "./storage";

// ─── JWT helpers ──────────────────────────────────────────────────────────────
const JWT_SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "detran-patrimonio-secret-2025"
);

async function signAppToken(payload: { userId: number; username: string; role: string }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(JWT_SECRET_KEY);
}

async function verifyAppToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET_KEY);
    return payload as { userId: number; username: string; role: string };
  } catch {
    return null;
  }
}

// ─── Storage helper ───────────────────────────────────────────────────────────
function randomSuffix() {
  return Math.random().toString(36).substring(2, 10);
}

export const appRouter = router({
  system: systemRouter,

  // ─── Manus OAuth (mantido para compatibilidade) ──────────────────────────
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ─── App Auth (JWT simplificado) ─────────────────────────────────────────
  appAuth: router({
    login: publicProcedure
      .input(z.object({ username: z.string().min(1), password: z.string().min(1) }))
      .mutation(async ({ input }) => {
        const user = await loginAppUser(input.username, input.password);
        if (!user) {
          throw new Error("Usuário ou senha inválidos");
        }
        const token = await signAppToken({
          userId: user.id,
          username: user.username,
          role: user.role,
        });
        return {
          token,
          user: {
            id: user.id,
            username: user.username,
            displayName: user.displayName,
            role: user.role,
          },
        };
      }),

    verify: publicProcedure
      .input(z.object({ token: z.string() }))
      .query(async ({ input }) => {
        const payload = await verifyAppToken(input.token);
        return payload;
      }),
  }),

  // ─── Patrimônio ───────────────────────────────────────────────────────────
  patrimonio: router({
    list: publicProcedure
      .input(
        z.object({
          search: z.string().optional(),
          setor: z.string().optional(),
          local: z.string().optional(),
          status: z.enum(["localizado", "nao_localizado"]).optional(),
          tipo: z.enum(["informatica", "mobiliario", "eletrodomestico", "veiculo", "outros"]).optional(),
          dataInicio: z.string().optional(),
          dataFim: z.string().optional(),
          page: z.number().min(1).default(1),
          pageSize: z.number().min(1).max(200).default(25),
          sortBy: z.string().optional(),
          sortDir: z.enum(["asc", "desc"]).optional(),
        })
      )
      .query(async ({ input }) => getPatrimonioItems(input)),

    kpis: publicProcedure.query(async () => getPatrimonioKPIs()),
    bySetor: publicProcedure.query(async () => getPatrimonioBySetor()),
    timeline: publicProcedure.query(async () => getPatrimonioTimeline()),
    setores: publicProcedure.query(async () => getSetoresList()),
    locais: publicProcedure.query(async () => getLocaisList()),

    marcarLocalizado: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const result = await marcarLocalizado(input.id);
        invalidatePatrimonioCache();
        return result;
      }),

    criar: publicProcedure
      .input(
        z.object({
          patrimonio: z.number().int().positive(),
          descricao: z.string().min(1).max(500),
          setor: z.string().max(255).optional(),
          local: z.string().max(255).optional(),
          dataIncorporacao: z.string().optional(),
          valor: z.number().nonnegative().optional(),
          status: z.enum(["localizado", "nao_localizado"]).default("nao_localizado"),
          tipo: z.enum(["informatica", "mobiliario", "eletrodomestico", "veiculo", "outros"]).default("outros"),
        })
      )
      .mutation(async ({ input }) => {
        const result = await createPatrimonioItem(input);
        invalidatePatrimonioCache();
        return result;
      }),
  }),

  // ─── Levantamento Anual ───────────────────────────────────────────────────
  levantamento: router({
    list: publicProcedure
      .input(z.object({ ano: z.number().optional() }))
      .query(async ({ input }) => getLevantamentoAnual(input.ano)),

    anos: publicProcedure.query(async () => getLevantamentoAnosDisponiveis()),

    fotos: publicProcedure
      .input(z.object({ levantamentoId: z.number() }))
      .query(async ({ input }) => getLevantamentoFotos(input.levantamentoId)),

    criar: publicProcedure
      .input(
        z.object({
          ano: z.number().int().min(2020).max(2100),
          patrimonio: z.number().int().positive(),
          descricao: z.string().min(1).max(500),
          setor: z.string().max(255).optional(),
          local: z.string().max(255).optional(),
          status: z.enum(["localizado", "nao_localizado", "em_verificacao"]).default("em_verificacao"),
          tipo: z.enum(["informatica", "mobiliario", "eletrodomestico", "veiculo", "outros"]).default("outros"),
          observacao: z.string().max(1000).optional(),
          responsavel: z.string().max(128).optional(),
          createdBy: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => createLevantamentoItem(input)),

    atualizarStatus: publicProcedure
      .input(
        z.object({
          id: z.number(),
          status: z.enum(["localizado", "nao_localizado", "em_verificacao"]),
        })
      )
      .mutation(async ({ input }) => {
        await updateLevantamentoStatus(input.id, input.status);
        return { success: true };
      }),

    deletar: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteLevantamentoItem(input.id);
        return { success: true };
      }),

    uploadFoto: publicProcedure
      .input(
        z.object({
          levantamentoId: z.number(),
          base64: z.string(), // data:image/jpeg;base64,...
          mimeType: z.string().default("image/jpeg"),
          tamanhoBytes: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        // Decodificar base64
        const base64Data = input.base64.replace(/^data:[^;]+;base64,/, "");
        const buffer = Buffer.from(base64Data, "base64");

        const ext = input.mimeType.includes("png") ? "png" : "jpg";
        const fileKey = `levantamento/${input.levantamentoId}/foto-${randomSuffix()}.${ext}`;

        const { url } = await storagePut(fileKey, buffer, input.mimeType);

        const foto = await addLevantamentoFoto({
          levantamentoId: input.levantamentoId,
          url,
          thumbUrl: url, // mesma URL (otimização feita no frontend)
          fileKey,
          mimeType: input.mimeType,
          tamanhoBytes: input.tamanhoBytes ?? buffer.length,
        });

        return foto;
      }),
  }),
});

export type AppRouter = typeof appRouter;
