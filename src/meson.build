pkgdatadir = get_option('datadir') / meson.project_name()
gnome = import('gnome')

src_res = gnome.compile_resources('org.gnome.Example.src',
  'org.gnome.Example.src.gresource.xml',
  gresource_bundle: true,
  install: true,
  install_dir: pkgdatadir,
)

data_res = gnome.compile_resources('org.gnome.Example.data',
  'org.gnome.Example.data.gresource.xml',
  gresource_bundle: true,
  install: true,
  install_dir: pkgdatadir,
)

bin_conf = configuration_data()
bin_conf.set('GJS', find_program('gjs').full_path())
bin_conf.set('PACKAGE_VERSION', meson.project_version())
bin_conf.set('PACKAGE_NAME', meson.project_name())
bin_conf.set('prefix', get_option('prefix'))
bin_conf.set('libdir', get_option('prefix') / get_option('libdir'))
bin_conf.set('datadir', meson.current_build_dir())
bin_conf.set('resource_path', '/org/gnome/Example')

configure_file(
  input: 'org.gnome.Example.in',
  output: 'org.gnome.Example',
  configuration: bin_conf,
  install: true,
  install_dir: get_option('bindir')
)
