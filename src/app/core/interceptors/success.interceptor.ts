import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { tap } from 'rxjs';

interface ApiResponse {
    success?: boolean;
    message?: string;
    hasEnabledAward?: boolean;
    result?: {
        message?: string;
    };
}

export const SuccessInterceptor: HttpInterceptorFn = (req, next) => {
    const messageService = inject(MessageService);
    const translate = inject(TranslateService);

    return next(req).pipe(
        tap((event) => {
            if (!(event instanceof HttpResponse)) return;
            if (event.status < 200 || event.status >= 300) return;
            if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) return;
            if (req.url.includes('search/all-projects')) return;

            const body = event.body as ApiResponse | null;
            if (body?.success === false) return;

            const message =
                body?.message ||
                body?.result?.message ||
                'Operation completed successfully';
            messageService.add({
                severity: body?.hasEnabledAward === true || body?.hasEnabledAward === undefined ? 'success' : 'info',
                summary: body?.hasEnabledAward === true || body?.hasEnabledAward === undefined ? translate.instant('general.success') : translate.instant('general.award_disabled_info_header_message'),
                detail: message,
                life: 3000,
            });
        })
    );
};
