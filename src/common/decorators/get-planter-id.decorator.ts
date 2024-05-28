import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ValidationUUID } from '@/utils';

export const GetPlanterId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const platerId = request.params.planterId;

    const validationUUID = new ValidationUUID();
    validationUUID.transform(platerId);

    return platerId;
  },
);
