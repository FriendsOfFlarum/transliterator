import SettingsModal from 'flarum/components/SettingsModal';
import Button from 'flarum/components/Button';
import SelectItem from '@fof/components/admin/settings/items/SelectItem';

export default class TransliteratorSettingsModal extends SettingsModal {
    init() {
        super.init();

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
                    children: app.translator.trans('fof-transliterator.admin.settings.parse_button'),
                    onclick: this.submitParse.bind(this),
                })}
            </div>,
            <div className="Form-group">
                <label>{app.translator.trans('fof-transliterator.admin.settings.package_label')}</label>

                {SelectItem.component({
                    options: app.data['fof-transliterator.packages'].reduce((o, p) => {
                        o[p] = app.translator.trans(`fof-transliterator.admin.settings.package_${p}_label`);

                        return o;
                    }, {}),
                    key: 'fof-transliterator.package',
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

                m.lazyRedraw();
            });
    }
}
