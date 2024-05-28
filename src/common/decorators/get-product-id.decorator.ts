import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ValidationUUID } from '@/utils';

export const GetProductId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const productId = request.params.productId;

    const validationUUID = new ValidationUUID();
    validationUUID.transform(productId);

    return productId;
  },
);
