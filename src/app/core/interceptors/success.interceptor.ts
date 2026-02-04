import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { tap } from 'rxjs';

interface ApiResponse {
    success?: boolean;
    message?: string;
    result?: {
        message?: string;
    };
}

export const SuccessInterceptor: HttpInterceptorFn = (req, next) => {
    const messageService = inject(MessageService);

    return next(req).pipe(
        tap((event) => {
            if (!(event instanceof HttpResponse)) return;
            if (event.status < 200 || event.status >= 300) return;
            if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) return;

            const body = event.body as ApiResponse | null;
            if (body?.success === false) return;

            const message =
                body?.message ||
                body?.result?.message ||
                'Operation completed successfully';

            messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: message,
                life: 3000,
            });
        })
    );
};
