import { ValidationUUID } from '@/utils';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetOptionId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    const optionId = request.params.optionId;

    const validationUUID = new ValidationUUID();
    validationUUID.transform(optionId);

    return optionId;
  },
);
