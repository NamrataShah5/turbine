import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Observable } from 'rxjs';
import { ModalAlertService } from '../modal-alert/modal-alert.service';

@Injectable({
    providedIn: 'root',
})
export class ModalCancelApiService {
    private renderer: Renderer2;
    constructor(
        private modalAlertService: ModalAlertService,
        rendererFactory: RendererFactory2
    ) {
        this.renderer = rendererFactory.createRenderer(null, null);
    }

    public show(): Observable<boolean> {
        return new Observable((observer) => {
            this.renderer.addClass(document.body, 'alert-modal-open');
            this.modalAlertService.showModalAlert({
                type: 'warning',
                heading: 'Cancel this request?',
                message: `This request might be taking too long.`,
                buttons: [
                    {
                        title: 'Go back',
                        onClick: () => {
                            this.renderer.removeClass(document.body, 'alert-modal-open');
                        },
                        style: 'secondary',
                    },
                    {
                        title: 'Cancel',
                        onClick: async () => {
                            this.renderer.removeClass(document.body, 'alert-modal-open');
                            observer.next(true);
                        },
                        style: 'primary',
                    },
                ],
            });
        })
    }
}
