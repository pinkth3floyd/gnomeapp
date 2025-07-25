/* window.js
 *
 * Copyright 2025 pj
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import GObject from 'gi://GObject';
import Gtk from 'gi://Gtk';
import Adw from 'gi://Adw';

export const TestWindow = GObject.registerClass({
    GTypeName: 'TestWindow',
    Template: 'resource:///org/gnome/Example/window.ui',
    InternalChildren: ['label', 'button1', 'button2', 'button3', 'status_label'],
}, class TestWindow extends Adw.ApplicationWindow {
    constructor(application) {
        super({ application });
        this.clickCount = 0;
    }

    on_button1_clicked(button) {
        this.clickCount++;
        this.status_label.label = `Button clicked ${this.clickCount} time(s)!`;
        console.log(`Button 1 clicked ${this.clickCount} times`);
    }

    on_button2_clicked(button) {
        const messages = [
            "Hello, World!",
            "Welcome to GNOME!",
            "This is a test application",
            "Buttons are working!",
            "GTK4 is awesome!"
        ];
        const randomIndex = Math.floor(Math.random() * messages.length);
        this.label.label = messages[randomIndex];
        this.status_label.label = "Text changed!";
        console.log("Button 2 clicked - text changed");
    }

    on_button3_clicked(button) {
        this.label.label = "Hello, World!";
        this.clickCount = 0;
        this.status_label.label = "Reset to default state!";
        console.log("Button 3 clicked - reset");
    }
});

