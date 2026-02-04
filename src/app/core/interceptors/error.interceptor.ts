import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { catchError, throwError } from 'rxjs';

export const ErrorInterceptor: HttpInterceptorFn = (req, next) => {
    const messageService = inject(MessageService);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            let message = 'Something went wrong';
            const errorMessage = error.error;

            if (errorMessage?.message) {
                message = errorMessage.message;
            }
            else if (errorMessage?.errors) {
                message = Object.values(errorMessage.errors)
                    .flat()
                    .join('\n');
            }

            messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: message,
                life: 5000,
            });

            return throwError(() => error);
        })
    );
};
