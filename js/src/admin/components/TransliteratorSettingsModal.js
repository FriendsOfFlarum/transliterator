import Modal from 'flarum/components/Modal';
import Button from 'flarum/components/Button';

export default class TransliteratorSettingsModal extends Modal {
    init() {
        super.init();

        this.loading = false;
        this.count = null;
    }

    className() {
        return 'Modal--medium';
    }

    title() {
        return app.translator.trans('fof-transliterator.admin.settings.title');
    }

    content() {
        const count = this.count !== null && String(this.count);

        return [
            <div className="Modal-body">
                {count && (
                    <p>{app.translator.transChoice('fof-transliterator.admin.settings.result', count, { count })}</p>
                )}

                {Button.component({
                    className: 'Button Button--primary',
                    loading: this.loading,
                    disabled: !!count,
                    children: app.translator.trans('fof-transliterator.admin.settings.parse_button'),
                    onclick: this.onsubmit.bind(this),
                })}
            </div>,
        ];
    }

    onsubmit() {
        this.loading = true;

        return app
            .request({
                method: 'POST',
                url: `${app.forum.attribute('apiUrl')}/fof/transliterator/parse`,
            })
            .then(res => {
                this.loading = false;
                this.count = res.count;

                m.lazyRedraw();
            });
    }
}
