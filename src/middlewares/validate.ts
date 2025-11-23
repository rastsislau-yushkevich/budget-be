import { type ClassConstructor, plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import type { RequestHandler } from "express";

export function validateDto<T extends object>(
	dto: ClassConstructor<T>,
): RequestHandler {
	return async (req, res, next) => {
		const instance = plainToInstance(dto, req.body);

		const errors = await validate(instance, {
			whitelist: true,
			forbidNonWhitelisted: false,
		});

		if (errors.length > 0) {
			return res.status(400).json({
				message: "Validation failed",
				errors: errors.map((e) =>
					e.constraints ? Object.values(e.constraints) : [],
				),
			});
		}

		req.body = instance;
		next();
	};
}
