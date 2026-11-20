(function () {
  const listeners = {};
  const Bus = {
    on(name, fn) {
      (listeners[name] = listeners[name] || []).push(fn);
    },
    emit(name, data) {
      (listeners[name] || []).forEach((fn) => fn(data));
    },
  };

  const safeStorage = {
    get(area, key) {
      try {
        return area.getItem(key);
      } catch {
        return null;
      }
    },
    set(area, key, value) {
      try {
        area.setItem(key, value);
        return true;
      } catch {
        return false;
      }
    },
  };

  const STORAGE_KEY = 'portfolio-flags-v1';
  const emptyState = () => ({ found: {}, colors: {}, hints: {} });

  const Store = {
    state: emptyState(),
    load() {
      const saved = safeStorage.get(localStorage, STORAGE_KEY);
      if (!saved) return;
      try {
        this.state = { ...emptyState(), ...JSON.parse(saved) };
      } catch {
        this.state = emptyState();
      }
    },
    save() {
      safeStorage.set(localStorage, STORAGE_KEY, JSON.stringify(this.state));
    },
  };

  function h(tag, attrs, ...kids) {
    const el = document.createElement(tag);
    for (const [key, value] of Object.entries(attrs || {})) {
      if (value == null || value === false) continue;
      if (key.startsWith('on')) el.addEventListener(key.slice(2), value);
      else if (key === 'class') el.className = value;
      else if (key === 'style') el.style.cssText = value;
      else el.setAttribute(key, value === true ? '' : value);
    }
    fill(el, ...kids);
    return el;
  }

  function fill(parent, ...kids) {
    kids.flat(Infinity).forEach((kid) => {
      if (kid == null || kid === false) return;
      parent.append(kid.nodeType ? kid : document.createTextNode(kid));
    });
    return parent;
  }

  function externalLink(href, attrs, ...kids) {
    return h('a', { href, target: '_blank', rel: 'noopener noreferrer', ...attrs }, ...kids);
  }

  const SVG_ICONS = ['network', 'shield', 'badge'];
  const iconSrc = (name) => `icons/${name}.${SVG_ICONS.includes(name) ? 'svg' : 'png'}`;

  function icon(src, cls) {
    return h('img', { class: 'ico ' + (cls || ''), src, alt: '', draggable: 'false' });
  }

  function mIcon(name, cls) {
    return icon(iconSrc(name), cls);
  }

  function bindPopupMenu(menu, { itemSelector, steps, dismiss, ignoreClicksOn }) {
    const onPointerDown = (event) => {
      const inside = menu.contains(event.target) || ignoreClicksOn?.contains(event.target);
      if (!inside) dismiss('outside');
    };
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        event.preventDefault();
        dismiss('escape');
        return;
      }
      const step = steps[event.key];
      if (!step) return;
      event.preventDefault();
      const items = [...menu.querySelectorAll(itemSelector)];
      const index = items.indexOf(document.activeElement);
      items[(index + step + items.length) % items.length].focus();
    };
    document.addEventListener('pointerdown', onPointerDown, true);
    document.addEventListener('keydown', onKeyDown, true);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown, true);
      document.removeEventListener('keydown', onKeyDown, true);
    };
  }

  window.Bus = Bus;
  window.Store = Store;
  window.safeStorage = safeStorage;
  window.h = h;
  window.fill = fill;
  window.externalLink = externalLink;
  window.icon = icon;
  window.mIcon = mIcon;
  window.bindPopupMenu = bindPopupMenu;
})();
