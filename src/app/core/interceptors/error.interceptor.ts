import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { catchError, throwError } from 'rxjs';

export const ErrorInterceptor: HttpInterceptorFn = (req, next) => {
    const messageService = inject(MessageService);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            let message = 'Something went wrong';

            // رسالة جاية من الـ backend
            if (error.error?.message) {
                message = error.error.message;
            }
            // validation errors
            else if (error.error?.errors) {
                message = Object.values(error.error.errors)
                    .flat()
                    .join(', ');
            }

            messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: message,
                life: 4000,
            });

            return throwError(() => error);
        })
    );
};
