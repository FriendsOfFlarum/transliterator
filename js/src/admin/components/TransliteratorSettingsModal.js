import Button from 'flarum/components/Button';
import { settings } from '@fof-components';
const {
    SettingsModal,
    items: { SelectItem },
} = settings;

export default class TransliteratorSettingsModal extends SettingsModal {
    oninit(vnode) {
        super.oninit(vnode);

        this.loadingParse = false;
        this.count = null;
    }

    className() {
        return 'Modal--medium';
    }

    title() {
        return app.translator.trans('fof-transliterator.admin.settings.title');
    }

    form() {
        const count = this.count !== null && String(this.count);

        return [
            <div className="Form-group">
                {count && <p>{app.translator.transChoice('fof-transliterator.admin.settings.result', count, { count })}</p>}

                {Button.component({
                    className: 'Button Button--primary',
                    loading: this.loadingParse,
                    disabled: !!count,
                    onclick: this.submitParse.bind(this),
                }, app.translator.trans('fof-transliterator.admin.settings.parse_button'))}
            </div>,
            <div className="Form-group">
                <label>{app.translator.trans('fof-transliterator.admin.settings.package_label')}</label>

                {SelectItem.component({
                    options: app.data['fof-transliterator.packages'].reduce((o, p) => {
                        o[p] = app.translator.trans(`fof-transliterator.admin.settings.package_${p}_label`);

                        return o;
                    }, {}),
                    name: 'fof-transliterator.package',
                    required: true,
                })}
            </div>,
        ];
    }

    submitParse() {
        this.loadingParse = true;

        return app
            .request({
                method: 'POST',
                url: `${app.forum.attribute('apiUrl')}/fof/transliterator/parse`,
            })
            .then(res => {
                this.loadingParse = false;
                this.count = res.count;

                m.redraw();
            });
    }
}
