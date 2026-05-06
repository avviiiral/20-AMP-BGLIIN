import { Component } from '@angular/core';

interface SidebarItem {
  key: string;
  label: string;
  icon: string;
  route?: string;
}

interface SidebarChildItem {
  key: string;
  label: string;
  icon: string;
  route?: string;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  showLogoutModal = false;
  activeItemKey = 'home';
  settingsOpen = false;

  readonly menuItems: SidebarItem[] = [
    { key: 'home', label: 'Home', icon: 'fa-house', route: '/dashboard' },
    { key: 'leaders', label: 'Leaders', icon: 'fa-trophy', route: '/leaders' },
    { key: 'lines', label: 'Lines', icon: 'fa-layer-group', route: '/lines' },
    { key: 'improve', label: 'Improve', icon: 'fa-lightbulb', route: '/improve' },
    { key: 'health', label: 'Health', icon: 'fa-heart-pulse', route: '/health' },
    { key: 'settings', label: 'Settings', icon: 'fa-gear' }
  ];

  readonly settingsChildren: SidebarChildItem[] = [
    { key: 'targets', label: 'Targets', icon: 'fa-sliders', route: '/settings/targets' },
    { key: 'shifts', label: 'Shifts', icon: 'fa-clock', route: '/settings/shifts' },
    { key: 'teams', label: 'Teams', icon: 'fa-users', route: '/settings/teams' },
    { key: 'profile', label: 'Profile', icon: 'fa-circle-user', route: '/settings/profile' },
    { key: 'help', label: 'Help', icon: 'fa-circle-question' }
  ];
  mobileSidebarOpen = false;


  openIndex: number | null = null;

  ngOnInit(): void {
  }

  toggleMenu(index: number): void {
    this.openIndex = this.openIndex === index ? null : index;
  }

  toggleSidebar(): void {
    this.mobileSidebarOpen = !this.mobileSidebarOpen;
  }

  closeSidebar(): void {
    this.mobileSidebarOpen = false;
  }

  toggleSettings(event: MouseEvent): void {
    event.preventDefault();
    this.settingsOpen = !this.settingsOpen;
  }


}
