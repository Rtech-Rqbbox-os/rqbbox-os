(function() {
  tinymce.PluginManager.add('rqbbox_os', function(editor, url) {
    editor.addButton('rqbbox_os', {
      title: 'Insert RQBBOX OS Info Card',
      image: 'https://rtech-rqbbox-os.github.io/rqbbox-os/System/Branding/rqbbox-logo.svg',
      onclick: function() {
        editor.windowManager.open({
          title: 'RQBBOX OS Info Card',
          body: [{ type: 'checkbox', name: 'compact', label: 'Compact mode' }],
          onsubmit: function(e) {
            editor.insertContent('[rqbbox_os_card' + (e.data.compact ? ' compact="true"' : '') + ']');
          }
        });
      }
    });
  });
})();
