project('test',
          version: '0.1.0',
    meson_version: '>= 1.0.0',
  default_options: [ 'warning_level=2', 'werror=false', ],
)

gnome = import('gnome')

subdir('data')
subdir('src')

gnome.post_install(
    gtk_update_icon_cache: true,
  update_desktop_database: true,
)
