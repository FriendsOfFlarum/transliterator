import app from 'flarum/app';
import Button from 'flarum/common/components/Button';

app.initializers.add('fof/transliterator', () => {
    let parsingDiscussions = false;
    let numberOfParsedDiscussions = null;

    app.extensionData
        .for('fof-transliterator')
        .registerSetting(function () {
            return (
                <div className="Form-group">
                    {Button.component(
                        {
                            className: 'Button Button--primary',
                            loading: parsingDiscussions,
                            disabled: numberOfParsedDiscussions !== null,
                            onclick: () => {
                                parsingDiscussions = true;

                                return app
                                    .request({
                                        method: 'POST',
                                        url: `${app.forum.attribute('apiUrl')}/fof/transliterator/parse`,
                                    })
                                    .then((res) => {
                                        parsingDiscussions = false;
                                        numberOfParsedDiscussions = res.count;

                                        m.redraw();
                                    });
                            },
                        },
                        numberOfParsedDiscussions === null
                            ? app.translator.trans('fof-transliterator.admin.settings.parse_button')
                            : // Parse count to string to preserve zero in translated string
                              app.translator.trans('fof-transliterator.admin.settings.result', { count: String(numberOfParsedDiscussions) })
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
