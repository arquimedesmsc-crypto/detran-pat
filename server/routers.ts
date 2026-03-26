import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import {
  createPatrimonioItem,
  getLocaisList,
  getPatrimonioBySetor,
  getPatrimonioItems,
  getPatrimonioKPIs,
  getPatrimonioTimeline,
  getSetoresList,
  invalidatePatrimonioCache,
  marcarLocalizado,
} from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

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
      .query(async ({ input }) => {
        return getPatrimonioItems(input);
      }),

    kpis: publicProcedure.query(async () => {
      return getPatrimonioKPIs();
    }),

    bySetor: publicProcedure.query(async () => {
      return getPatrimonioBySetor();
    }),

    timeline: publicProcedure.query(async () => {
      return getPatrimonioTimeline();
    }),

    setores: publicProcedure.query(async () => {
      return getSetoresList();
    }),

    locais: publicProcedure.query(async () => {
      return getLocaisList();
    }),

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
          tipo: z
            .enum(["informatica", "mobiliario", "eletrodomestico", "veiculo", "outros"])
            .default("outros"),
        })
      )
      .mutation(async ({ input }) => {
        const result = await createPatrimonioItem(input);
        invalidatePatrimonioCache();
        return result;
      }),
  }),
});

export type AppRouter = typeof appRouter;
