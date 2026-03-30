import { COOKIE_NAME } from "@shared/const";
import { SignJWT, jwtVerify } from "jose";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import {
  addLevantamentoFoto,
  addSystemLog,
  createAppUser,
  createLevantamentoItem,
  createPatrimonioItem,
  deleteLevantamentoItem,
  formatarCSV,
  formatarPDF,
  formatarXLSX,
  getLevantamentoAnual,
  getLevantamentoAnosDisponiveis,
  getLevantamentoFotos,
  getLocaisList,
  getPatrimonioBySetor,
  getPatrimonioItems,
  getPatrimonioKPIs,
  getPatrimonioTimeline,
  getSetoresList,
  getSystemLogs,
  invalidatePatrimonioCache,
  listAppUsers,
  loginAppUser,
  marcarLocalizado,
  updateAppUser,
  updateLevantamentoStatus,
  getAppUserById,
  updateAppUserProfile,
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
          andar: z.string().optional(),
          valorMin: z.number().optional(),
          valorMax: z.number().optional(),
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

    export: publicProcedure
      .input(z.object({
        items: z.array(z.any()),
        filters: z.object({
          setor: z.string().optional(),
          status: z.string().optional(),
          tipo: z.string().optional(),
        }).optional(),
        format: z.enum(["csv", "xlsx", "pdf"]),
      }))
      .mutation(async ({ input }) => {
        const { items, format } = input;
        
        if (format === "csv") {
          const csv = formatarCSV(items);
          return { data: csv, contentType: "text/csv;charset=utf-8" };
        } else if (format === "xlsx") {
          const buffer = await formatarXLSX(items);
          return { data: buffer.toString("base64"), contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" };
        } else if (format === "pdf") {
          const buffer = await formatarPDF(items);
          return { data: buffer.toString("base64"), contentType: "application/pdf" };
        }
        
        throw new Error("Formato inválido");
      }),
  }),  // ─── Admin ───────────────────────────────────────────────────────────────────
  admin: router({
    listUsers: publicProcedure
      .input(z.object({ token: z.string() }))
      .query(async ({ input }) => {
        const payload = await verifyAppToken(input.token);
        if (!payload || payload.role !== "admin") throw new Error("Acesso negado.");
        return listAppUsers();
      }),

    createUser: publicProcedure
      .input(z.object({
        token: z.string(),
        username: z.string().min(3).max(64),
        password: z.string().min(4).max(128),
        displayName: z.string().min(1).max(128),
        cargo: z.string().max(128).optional(),
        idFuncional: z.string().max(32).optional(),
        setor: z.string().max(128).optional(),
        email: z.string().email().optional(),
        role: z.enum(["admin", "user"]).default("user"),
      }))
      .mutation(async ({ input }) => {
        const payload = await verifyAppToken(input.token);
        if (!payload || payload.role !== "admin") throw new Error("Acesso negado.");
        const user = await createAppUser(input);
        await addSystemLog({ userId: payload.userId, username: payload.username, acao: "criar_usuario", entidade: "app_users", entidadeId: String(user?.id), detalhes: `Criou usuário ${input.username}` });
        return user;
      }),

    updateUser: publicProcedure
      .input(z.object({
        token: z.string(),
        id: z.number(),
        displayName: z.string().min(1).max(128).optional(),
        cargo: z.string().max(128).optional(),
        idFuncional: z.string().max(32).optional(),
        setor: z.string().max(128).optional(),
        email: z.string().email().optional(),
        role: z.enum(["admin", "user"]).optional(),
        ativo: z.boolean().optional(),
        password: z.string().min(4).max(128).optional(),
      }))
      .mutation(async ({ input }) => {
        const payload = await verifyAppToken(input.token);
        if (!payload || payload.role !== "admin") throw new Error("Acesso negado.");
        const { token, id, ...data } = input;
        const user = await updateAppUser(id, data);
        await addSystemLog({ userId: payload.userId, username: payload.username, acao: "atualizar_usuario", entidade: "app_users", entidadeId: String(id), detalhes: `Atualizou usuário ID ${id}` });
        return user;
      }),

    logs: publicProcedure
      .input(z.object({
        token: z.string(),
        page: z.number().min(1).default(1),
        pageSize: z.number().min(1).max(100).default(50),
        acao: z.string().optional(),
        entidade: z.string().optional(),
      }))
      .query(async ({ input }) => {
        const payload = await verifyAppToken(input.token);
        if (!payload || payload.role !== "admin") throw new Error("Acesso negado.");
        return getSystemLogs({ page: input.page, pageSize: input.pageSize, acao: input.acao, entidade: input.entidade });
      }),
  }),

  // ─── Levantamento Anual ───────────────────────────────────────────────────────────────────
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

  // ─── Perfil do Usuário ───────────────────────────────────────────────────────
  perfil: router({
    get: publicProcedure
      .input(z.object({ token: z.string() }))
      .query(async ({ input }) => {
        const payload = await verifyAppToken(input.token);
        if (!payload) throw new Error("Token inválido");
        const user = await getAppUserById(payload.userId);
        if (!user) throw new Error("Usuário não encontrado");
        return {
          id: user.id,
          username: user.username,
          displayName: user.displayName,
          cargo: user.cargo,
          idFuncional: user.idFuncional,
          setor: user.setor,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
          lastLogin: user.lastLogin,
        };
      }),

    update: publicProcedure
      .input(
        z.object({
          token: z.string(),
          displayName: z.string().min(2).max(128).optional(),
          cargo: z.string().max(128).optional(),
          idFuncional: z.string().max(32).optional(),
          setor: z.string().max(128).optional(),
          email: z.string().email().optional().or(z.literal("")),
          currentPassword: z.string().optional(),
          newPassword: z.string().min(4).max(64).optional(),
        })
      )
      .mutation(async ({ input }) => {
        const payload = await verifyAppToken(input.token);
        if (!payload) throw new Error("Token inválido");
        const { token, currentPassword, newPassword, ...updateData } = input;
        const result = await updateAppUserProfile(payload.userId, updateData, currentPassword, newPassword);
        if (!result.success) throw new Error(result.error ?? "Erro ao atualizar perfil");
        return { success: true };
      }),

    solicitarAlteracao: publicProcedure
      .input(
        z.object({
          token: z.string(),
          campo: z.string(),
          valorAtual: z.string().optional(),
          valorSolicitado: z.string(),
          motivo: z.string().max(500).optional(),
        })
      )
      .mutation(async ({ input }) => {
        const payload = await verifyAppToken(input.token);
        if (!payload) throw new Error("Token inválido");
        await addSystemLog({
          userId: payload.userId,
          username: payload.username,
          acao: "SOLICITACAO_ALTERACAO",
          entidade: "perfil",
          entidadeId: String(payload.userId),
          detalhes: JSON.stringify({
            campo: input.campo,
            valorAtual: input.valorAtual,
            valorSolicitado: input.valorSolicitado,
            motivo: input.motivo,
          }),
        });
        return { success: true, mensagem: "Solicitação enviada ao administrador" };
      }),
  }),
});
export type AppRouter = typeof appRouter;
