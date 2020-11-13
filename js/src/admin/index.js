import TransliteratorSettingsModal from './components/TransliteratorSettingsModal';

app.initializers.add('fof/transliterator', () => {
    app.extensionSettings['fof-transliterator'] = () => app.modal.show(TransliteratorSettingsModal);
});
