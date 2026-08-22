(function () {
  'use strict';

  const screens = [
    {
      src: 'assets/img/sistema/sll-locacoes-dashboard.webp',
      title: 'Dashboard da operação',
      description: 'Visão consolidada dos principais indicadores da empresa.',
    },
    {
      src: 'assets/img/sistema/sll-locacoes-calendario.webp',
      title: 'Agenda de locações',
      description:
        'Programação de equipamentos, clientes e responsáveis em um único calendário.',
    },
    {
      src: 'assets/img/sistema/sll-locacoes-contrato.webp',
      title: 'Contratos e documentos',
      description: 'Geração de documentos vinculados diretamente à locação.',
    },
    {
      src: 'assets/img/sistema/sll-locacoes-fotos.webp',
      title: 'Equipamentos e evidências',
      description:
        'Cadastro de equipamentos e registro de fotos de início e fim da locação.',
    },
    {
      src: 'assets/img/sistema/sll-documento-assinatura.webp',
      title: 'Assinatura eletrônica',
      description: 'Formalização e acompanhamento da assinatura de documentos.',
    },
    {
      src: 'assets/img/sistema/sll-financeiro-dashboard.webp',
      title: 'Dashboard financeiro',
      description:
        'Saldos, valores em aberto, resultados do período e comparação mensal.',
    },
    {
      src: 'assets/img/sistema/sll-financeiro-contas.webp',
      title: 'Contas a receber e a pagar',
      description:
        'Parcelas, vencimentos, recebimentos, pagamentos e controle de cheques.',
    },
    {
      src: 'assets/img/sistema/sll-financeiro-fluxo-caixa.webp',
      title: 'Fluxo de caixa',
      description:
        'Previsão de entradas, saídas e saldos futuros em todos os caixas.',
    },
    {
      src: 'assets/img/sistema/sll-financeiro-caixa.webp',
      title: 'Caixas e movimentações',
      description:
        'Bancos, caixas e indicadores financeiros conectados à operação.',
    },
    {
      src: 'assets/img/sistema/sll-financeiro-pix.webp',
      title: 'Cobranças integradas',
      description:
        'PIX, boleto, cartão e conciliação de pagamentos pelo Asaas.',
    },
    {
      src: 'assets/img/sistema/locacoes-fechamento-parceiro.webp',
      title: 'Fechamento de parceiros',
      description:
        'Conferência de repasses, comissões e resultados por parceiro.',
    },
    {
      src: 'assets/img/sistema/sll-links.webp',
      title: 'Formulários de captação',
      description:
        'Links e formulários configuráveis que cadastram novos clientes automaticamente.',
    },
    {
      src: 'assets/img/sistema/sll-crm-dashboard.webp',
      title: 'Dashboard do CRM',
      description:
        'Visão consolidada dos leads, oportunidades, tarefas e resultados da operação comercial.',
    },
    {
      src: 'assets/img/sistema/sll-crm-negocios.webp',
      title: 'Negócios e leads',
      description:
        'Acompanhamento das oportunidades desde a captação até a conversão, sem retrabalho.',
    },
    {
      src: 'assets/img/sistema/sll-crm-jornada.webp',
      title: 'Jornada do cliente',
      description:
        'Pedidos e oportunidades dos clientes atuais centralizados em uma única visão.',
    },
    {
      src: 'assets/img/sistema/sll-crm-automacao.webp',
      title: 'Automações do CRM',
      description:
        'Regras que movimentam a operação e ajudam a equipe a executar o próximo passo.',
    },
    {
      src: 'assets/img/sistema/sll-crm-tarefas.webp',
      title: 'Tarefas da equipe',
      description:
        'Organização das atividades internas e dos acompanhamentos comerciais.',
    },
    {
      src: 'assets/img/sistema/sll-crm-agenda-semanal.webp',
      title: 'Agenda semanal do CRM',
      description:
        'Compromissos e tarefas em uma visão de calendário para planejar a semana.',
    },
    {
      src: 'assets/img/sistema/sll-crm-configuracoes.webp',
      title: 'Configurações do CRM',
      description:
        'Campos, etapas e recursos ajustáveis ao processo comercial da empresa.',
    },
    {
      src: 'assets/img/sistema/sll-modelos-precos.webp',
      title: 'Modelos de preços',
      description:
        'Tabelas por equipamento e condições específicas por cliente registradas na negociação.',
    },
    {
      src: 'assets/img/sistema/sll-nfe-emitir.webp',
      title: 'Nota Fiscal Eletrônica Nacional',
      description:
        'Em breve, emissão de notas fiscais eletrônicas diretamente pela operação.',
    },
    {
      src: 'assets/img/sistema/sll-lila.webp',
      title: 'LILA e WhatsApp',
      description:
        'Atendimento automatizado e conversas integradas ao Sistema Laser.',
    },
    {
      src: 'assets/img/sistema/financeiro-mobile-left.webp',
      title: 'Acesso pelo celular',
      description:
        'Consulta da operação em uma interface responsiva para dispositivos móveis.',
    },
    {
      src: 'assets/img/sistema/sll-layout-acessivel.webp',
      title: 'Layout acessível',
      description:
        'Alternativa visual que favorece contraste e leitura da interface.',
    },
    {
      src: 'assets/img/sistema/sll-layout-confortavel.webp',
      title: 'Layout confortável',
      description:
        'Organização visual equilibrada para uma rotina prolongada no sistema.',
    },
    {
      src: 'assets/img/sistema/sll-layout-dark-mode.webp',
      title: 'Modo escuro',
      description:
        'Interface com tema escuro para mais conforto em ambientes com pouca luz.',
    },
  ];

  const screenIndexByFile = new Map(
    screens.map(function (screen, index) {
      return [screen.src.split('/').pop(), index];
    }),
  );
  screenIndexByFile.set(
    'sll-locacoes-dashboard-1280.webp',
    screenIndexByFile.get('sll-locacoes-dashboard.webp'),
  );
  screenIndexByFile.set(
    'sll-locacoes-dashboard-768.webp',
    screenIndexByFile.get('sll-locacoes-dashboard.webp'),
  );
  screenIndexByFile.set(
    'sll-crm-dashboard-1280.webp',
    screenIndexByFile.get('sll-crm-dashboard.webp'),
  );
  screenIndexByFile.set(
    'sll-crm-dashboard-768.webp',
    screenIndexByFile.get('sll-crm-dashboard.webp'),
  );
  screenIndexByFile.set(
    'sll-locacoes-fotos-1280.webp',
    screenIndexByFile.get('sll-locacoes-fotos.webp'),
  );
  screenIndexByFile.set(
    'sll-locacoes-fotos-768.webp',
    screenIndexByFile.get('sll-locacoes-fotos.webp'),
  );
  screenIndexByFile.set(
    'sll-locacoes-contrato-1280.webp',
    screenIndexByFile.get('sll-locacoes-contrato.webp'),
  );
  screenIndexByFile.set(
    'sll-locacoes-contrato-768.webp',
    screenIndexByFile.get('sll-locacoes-contrato.webp'),
  );
  screenIndexByFile.set(
    'locacoes-fechamento-parceiro-1280.webp',
    screenIndexByFile.get('locacoes-fechamento-parceiro.webp'),
  );
  screenIndexByFile.set(
    'locacoes-fechamento-parceiro-768.webp',
    screenIndexByFile.get('locacoes-fechamento-parceiro.webp'),
  );

  function createButton(className, label, content) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = className;
    button.setAttribute('aria-label', label);
    button.textContent = content;
    return button;
  }

  function initGallery() {
    const triggers = Array.from(
      document.querySelectorAll('img[src*="assets/img/sistema/"]'),
    ).filter(function (image) {
      return screenIndexByFile.has(
        image.currentSrc.split('/').pop().split('?')[0] ||
          image.src.split('/').pop().split('?')[0],
      );
    });

    if (!triggers.length) {
      return;
    }

    const gallery = document.createElement('div');
    gallery.className = 'screen-gallery';
    gallery.hidden = true;
    gallery.setAttribute('role', 'dialog');
    gallery.setAttribute('aria-modal', 'true');
    gallery.setAttribute('aria-labelledby', 'screen-gallery-title');
    gallery.setAttribute('aria-describedby', 'screen-gallery-description');

    const backdrop = document.createElement('button');
    backdrop.type = 'button';
    backdrop.className = 'screen-gallery__backdrop';
    backdrop.setAttribute('aria-label', 'Fechar visualizador');

    const panel = document.createElement('div');
    panel.className = 'screen-gallery__panel';

    const closeButton = createButton(
      'screen-gallery__close',
      'Fechar visualizador',
      '×',
    );
    const previousButton = createButton(
      'screen-gallery__control screen-gallery__control--previous',
      'Tela anterior',
      '‹',
    );
    const nextButton = createButton(
      'screen-gallery__control screen-gallery__control--next',
      'Próxima tela',
      '›',
    );

    const figure = document.createElement('figure');
    figure.className = 'screen-gallery__figure';

    const image = document.createElement('img');
    image.className = 'screen-gallery__image';
    image.alt = '';
    image.draggable = false;

    const caption = document.createElement('figcaption');
    caption.className = 'screen-gallery__caption';

    const title = document.createElement('strong');
    title.id = 'screen-gallery-title';

    const description = document.createElement('span');
    description.id = 'screen-gallery-description';

    const status = document.createElement('span');
    status.className = 'screen-gallery__status';
    status.setAttribute('aria-live', 'polite');

    const help = document.createElement('span');
    help.className = 'screen-gallery__help';
    help.textContent = 'Use as setas do teclado para navegar';

    caption.append(title, description, status, help);
    figure.append(image, caption);
    panel.append(closeButton, previousButton, figure, nextButton);
    gallery.append(backdrop, panel);
    document.body.append(gallery);

    let activeIndex = 0;
    let lastFocusedElement = null;
    let touchStartX = null;

    function preloadAdjacentScreens() {
      [activeIndex - 1, activeIndex + 1].forEach(function (index) {
        const preload = new Image();
        preload.src = screens[(index + screens.length) % screens.length].src;
      });
    }

    function showScreen(index) {
      activeIndex = (index + screens.length) % screens.length;
      const screen = screens[activeIndex];

      image.src = screen.src;
      image.alt = screen.title + '. ' + screen.description;
      title.textContent = screen.title;
      description.textContent = screen.description;
      status.textContent = activeIndex + 1 + ' de ' + screens.length;
      preloadAdjacentScreens();
    }

    function openGallery(index, trigger) {
      lastFocusedElement = trigger;
      showScreen(index);
      gallery.hidden = false;
      document.body.classList.add('screen-gallery-open');
      closeButton.focus();
    }

    function closeGallery() {
      gallery.hidden = true;
      document.body.classList.remove('screen-gallery-open');
      image.removeAttribute('src');

      if (lastFocusedElement) {
        lastFocusedElement.focus();
      }
    }

    function trapFocus(event) {
      const controls = [closeButton, previousButton, nextButton];
      const currentIndex = controls.indexOf(document.activeElement);

      if (event.shiftKey && currentIndex <= 0) {
        event.preventDefault();
        controls[controls.length - 1].focus();
      } else if (!event.shiftKey && currentIndex === controls.length - 1) {
        event.preventDefault();
        controls[0].focus();
      }
    }

    triggers.forEach(function (trigger) {
      const filename = (trigger.currentSrc || trigger.src)
        .split('/')
        .pop()
        .split('?')[0];
      const index = screenIndexByFile.get(filename);

      trigger.classList.add('system-screen-trigger');
      trigger.tabIndex = 0;
      trigger.setAttribute('role', 'button');
      trigger.setAttribute('aria-haspopup', 'dialog');
      trigger.setAttribute(
        'aria-label',
        'Ampliar ' + screens[index].title + ' e abrir galeria de telas',
      );

      trigger.addEventListener('click', function () {
        openGallery(index, trigger);
      });

      trigger.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openGallery(index, trigger);
        }
      });
    });

    closeButton.addEventListener('click', closeGallery);
    backdrop.addEventListener('click', closeGallery);
    previousButton.addEventListener('click', function () {
      showScreen(activeIndex - 1);
    });
    nextButton.addEventListener('click', function () {
      showScreen(activeIndex + 1);
    });

    image.addEventListener(
      'touchstart',
      function (event) {
        touchStartX = event.changedTouches[0].clientX;
      },
      { passive: true },
    );

    image.addEventListener(
      'touchend',
      function (event) {
        if (touchStartX === null) {
          return;
        }

        const distance = event.changedTouches[0].clientX - touchStartX;
        if (Math.abs(distance) > 50) {
          showScreen(activeIndex + (distance < 0 ? 1 : -1));
        }
        touchStartX = null;
      },
      { passive: true },
    );

    gallery.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        closeGallery();
      } else if (event.key === 'ArrowLeft') {
        showScreen(activeIndex - 1);
      } else if (event.key === 'ArrowRight') {
        showScreen(activeIndex + 1);
      } else if (event.key === 'Home') {
        showScreen(0);
      } else if (event.key === 'End') {
        showScreen(screens.length - 1);
      } else if (event.key === 'Tab') {
        trapFocus(event);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGallery);
  } else {
    initGallery();
  }
})();
