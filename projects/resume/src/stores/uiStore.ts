import { create } from 'zustand';
import type { SceneObjectKey } from './sceneStore';
import { resume } from '../data/resume';

export type PanelContent = {
  title: string;
  html: string;
} | null;

interface PanelState {
  open: boolean;
  content: PanelContent;
}

interface HelpState {
  open: boolean;
}

interface MobileState {
  dismissed: boolean;
}

interface UIState {
  panel: PanelState;
  help: HelpState;
  mobile: MobileState;

  openPanel: (key: SceneObjectKey) => void;
  closePanel: () => void;
  toggleHelp: () => void;
  closeHelp: () => void;
  dismissMobileNotice: () => void;
}

function buildPanelContent(key: SceneObjectKey): PanelContent {
  if (!key) return null;

  switch (key) {
    case 'laptop': {
      const projectCards = resume.projects
        .map(
          (p) => `
            <div class="panel-card">
              <h3>${p.name}</h3>
              <p>${p.desc}</p>
              <div class="tech-tags">${p.tech.map((t) => `<span>${t}</span>`).join('')}</div>
            </div>`
        )
        .join('');
      return { title: 'Projects', html: `<div class="panel-cards">${projectCards}</div>` };
    }

    case 'bookshelf': {
      const { frontend, backend, tools } = resume.skills;
      const section = (label: string, items: string[]) => `
        <div class="skill-group">
          <h3>${label}</h3>
          <ul>${items.map((s) => `<li>${s}</li>`).join('')}</ul>
        </div>`;
      return {
        title: 'Skills',
        html: section('Frontend', frontend) + section('Backend', backend) + section('Tools', tools)
      };
    }

    case 'frame': {
      const { name, role, bio, facts } = resume.about;
      return {
        title: 'About Me',
        html: `
          <div class="about-panel">
            <h2>${name}</h2>
            <p class="role">${role}</p>
            <p>${bio}</p>
            <ul class="facts">${facts.map((f) => `<li>${f}</li>`).join('')}</ul>
          </div>`
      };
    }

    case 'character': {
      const { email, github, linkedin, twitter, location, available } = resume.contact;
      return {
        title: 'Contact',
        html: `
          <div class="contact-panel">
            ${available ? '<p class="available-badge">Open to opportunities</p>' : ''}
            <ul>
              <li><strong>Email</strong> <a href="mailto:${email}">${email}</a></li>
              <li><strong>GitHub</strong> <a href="https://${github}" target="_blank" rel="noopener">${github}</a></li>
              <li><strong>LinkedIn</strong> <a href="https://${linkedin}" target="_blank" rel="noopener">${linkedin}</a></li>
              <li><strong>Twitter</strong> ${twitter}</li>
              <li><strong>Location</strong> ${location}</li>
            </ul>
          </div>`
      };
    }

    default:
      return null;
  }
}

export const useUIStore = create<UIState>((set) => ({
  panel: { open: false, content: null },
  help: { open: false },
  mobile: { dismissed: false },

  openPanel: (key) =>
    set({ panel: { open: true, content: buildPanelContent(key) } }),

  closePanel: () => {
    set({ panel: { open: false, content: null } });
    setTimeout(() => {
      set({ panel: { open: false, content: null } });
    }, 300);
  },

  toggleHelp: () =>
    set((state) => ({ help: { open: !state.help.open } })),

  closeHelp: () => set({ help: { open: false } }),

  dismissMobileNotice: () => set({ mobile: { dismissed: true } })
}));
