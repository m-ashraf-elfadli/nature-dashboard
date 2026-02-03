import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { tap } from 'rxjs';

export const SuccessInterceptor: HttpInterceptorFn = (req, next) => {
    const messageService = inject(MessageService);

    return next(req).pipe(
        tap((event) => {
            if (
                event instanceof HttpResponse &&
                ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)
            ) {
                messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Operation completed successfully',
                    life: 3000,
                });
            }
        })
    );
};
