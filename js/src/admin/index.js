import app from 'flarum/app';
import Button from 'flarum/components/Button';

app.initializers.add('fof/transliterator', () => {
    app.extensionData
        .for('fof-transliterator')
        .registerSetting(function() {
            this.loadingParse = false;
            this.count = null;
            const counted = this.count !== null && String(this.count);

            return (
                <div className="Form-group">
                    {counted && <p>{app.translator.transChoice('fof-transliterator.admin.settings.result', count, { count })}</p>}

                    {Button.component(
                        {
                            className: 'Button Button--primary',
                            loading: this.loadingParse,
                            disabled: !!counted,
                            onclick: () => {
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
                            },
                        },
                        app.translator.trans('fof-transliterator.admin.settings.parse_button')
                    )}
                </div>
            );
        })
        .registerSetting({
            label: app.translator.trans('fof-transliterator.admin.settings.package_label'),
            setting: 'fof-transliterator.package',
            type: 'select',
            required: true,
            options: app.data['fof-transliterator.packages'].reduce((o, p) => {
                o[p] = app.translator.trans(`fof-transliterator.admin.settings.package_${p}_label`);

                return o;
            }, {}),
            default: 'behat',
        });
});
