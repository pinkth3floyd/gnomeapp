desktop_file = configure_file(
        input: 'org.gnome.Example.desktop.in',
       output: 'org.gnome.Example.desktop',
      configuration: configuration_data(),
      install: true,
  install_dir: get_option('datadir') / 'applications'
)

desktop_utils = find_program('desktop-file-validate', required: false)
if desktop_utils.found()
  test('Validate desktop file', desktop_utils, args: [desktop_file])
endif

appstream_file = configure_file(
        input: 'org.gnome.Example.metainfo.xml.in',
       output: 'org.gnome.Example.metainfo.xml',
      configuration: configuration_data(),
      install: true,
  install_dir: get_option('datadir') / 'metainfo'
)

appstreamcli = find_program('appstreamcli', required: false, disabler: true)
test('Validate appstream file', appstreamcli,
     args: ['validate', '--no-net', '--explain', appstream_file])

subdir('icons')
