//  reduce automáticamente la barra de macros
function collapse(toggleId) {
  let target = document.getElementById(toggleId);
  if (target) {
    target.click()
  }
}

// mensaje de bienvenida cuando se activa el módulo
async function welcomeMessage() {
  ChatMessage.create({
    type: CONST.CHAT_MESSAGE_TYPES.OTHER,
    content: '🐙 Ph\'n glui,<br />Click en @Compendium[coc7-module-fr-toc.fr-compendiums-journalentry.BfWJfgDbvLoJTpkC]{ici} para acceder a toda la documentación de estos compendios. ¡Disfruta del juego!',
    speaker: { alias: "Cthulhu" }
  })
  game.user.setFlag("coc7-module-fr-toc", "welcomeMessageShown", true)
}

Hooks.on('ready', async function () {
  // actualización automática de los parámetros del sistema CoC7
  if (game.settings.get('CoC7', 'overrideSheetArtwork')) {
    const settings = {
      artworkMainFont: 'url(\'./modules/coc7-module-fr-toc/fonts/mailart-rubberstamp.ttf\') format(\'truetype\')',
      artworkMainFontBold: 'url(\'./modules/coc7-module-fr-toc/fonts/mailart-rubberstamp.ttf\') format(\'truetype\')',
      artworkMainFontSize: 16,
      artworkBackgroundColor: 'rgba(43,55,83,1)',
      artworkFrontColor: 'rgba(43,55,83,1)',
      artworkFixedSkillLength: false,
      unitDieColorset: 'white',
      tenDieNoMod: 'black',
      tenDieBonus: 'foundry',
      tenDiePenalty: 'bloodmoon',
      displayPlayerNameOnSheet: true,
      oneBlockBackstory: true
    }
    game.settings.settings.forEach(async setting => {
      if (typeof settings[setting.key] !== 'undefined' && 
            game.settings.get('CoC7', setting.key) !== settings[setting.key]) {
              await game.settings.set('CoC7', setting.key, settings[setting.key])
      }
    })
    // modificar el chorro en dicesonice para Hey listen funciona
    let isDsnActive = game.modules.has("dice-so-nice") ? game.modules.get('dice-so-nice').active : false ;
    if (isDsnActive) game.settings.set('dice-so-nice', 'immediatelyDisplayChatMessages', true);

    if (!game.user.getFlag("coc7-module-fr-toc", "welcomeMessageShown")) {
        welcomeMessage()
    }

  } else {
    await game.settings.set('CoC7', 'overrideSheetArtwork', true)
    window.location.reload()
  }

  collapse("bar-toggle")
})

Hooks.on('renderPause', async function () {
  document.getElementById("pause").children[0].setAttribute("src", "modules/coc7-module-fr-toc/images/logo.webp")
  document.getElementById("pause").children[1].innerHTML = "Pausa"
})

Hooks.on('renderJournalSheet', (app, html, options) => {
  html.on('click', 'a.pack-link', (event) => {
    const anchorElem = event.currentTarget;
    const packName = anchorElem?.dataset?.packName;
    const pack = game.packs.get(packName);
    if ( pack ) {
      pack.render(true);
    }
  })
})

document.getElementById("logo").setAttribute("src", "modules/coc7-module-fr-toc/images/logo.webp")
