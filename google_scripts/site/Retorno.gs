/* 
 * Criador: Leandro Augusto Fernandes de Magalhães
 *          Instituto de Computação da Unicamp (IC-UNICAMP)
 *
 * Descrição: Este script tem por objetivo crair um web-app que consiste em um painel destinado ao
 *            controle de retenção de passphrases pelos participantes. Contém uma caixa de texto para
 *            que o usuário entre com o número de ticket de seu cadastro (para requisitar da planilha
 *            a passphrase que foi atribuida a ele e comparar com a que ele digitar) e outra para que
 *            ele entre com a senha obtida. O usuário tem no mínimo 1 e no máximo 3 tentativas para
 *            inserir a senha correta, do contrário, o aplicativo é bloqueado.
 *            Após as tentativas, independente se corretas ou não, o usuário deve responder um
 *            questionário para efeitos estatisticos.
 *
 * Observações: 1-) Este script deve ser acoplado a um Site Google.
 */

/* Chave para a planilha contendo os usuarios participantes */
var userSSKey = '1yRiYsHw360rmr2_99AAeyuI0CqSs61trcGOkLY1e__k';

/* Chave para a planilha contendo as respostas do formulario de retorno */
var answerSSKey = '12zWLiHMcCbgVNyHZHn2-FPONlyG1HP8IIqIfdPTfwis';


function doGet() {
  var app = UiApp.createApplication().setTitle('mySecondApp');
  
  /* Criacao do painel de controle geral do experimento */
  var panel = app.createVerticalPanel();
  
  /* Criacao do painel de controle de login */
  var loginGrid = loginControlPanelCreation(app, panel);
  
  /* Criacao do painel de controle de tentativas */
  var returnGrid = returnControlPanelCreation(app, panel);
  
  /* Criacao do painel de controle do survey */
  var surveyGrid = surveyControlPanelCreation(app, panel);
  
  /* Adicao do painel de controle de login */
  panel.add(loginGrid);
  
  /* Adicao do painel de controle de tentativas */
  panel.add(returnGrid);
  
  /* Adicao do painel de controle do survey */
  panel.add(surveyGrid);
  
  /* Adicao do painel de controle geral */
  app.add(panel);
  
  return app;
}

/**
* func: loginControlPanelCreation
* desc: cria o painel de controle de respostas
*
* @param: app: estado atual do app
*         panel: painel de controle geral
* return: grid: painel de controle de login criado
**/
function loginControlPanelCreation(app, panel) {

  /* Variaveis do painel de controle de login */
  var grid = app.createGrid(4, 2).setId('loginGrid');
  var ticketLabel = app.createLabel('Por favor, insira seu número de Ticket (disponível em seu e-mail): ').setStyleAttribute("fontSize", "14");
  var ticketTextBox = app.createTextBox().setWidth('100px').setName('ticket');
  var submitButton = app.createButton('Submeter!').setId('submitButton');
  
  /* Criacao do tratador do botao de submissao */
  var ticketHandler = app.createServerClickHandler('verifyTicket');
  ticketHandler.addCallbackElement(panel);
  submitButton.addClickHandler(ticketHandler);
  
  /* Criacao do painel de controle de login */
  grid.setWidget(0, 0, ticketLabel)
      .setWidget(1, 0, ticketTextBox)
      .setWidget(2, 0, submitButton);
  
  return grid;
}

/**
* func: returnControlPanelCreation
* desc: cria o painel de controle de tentativas
*
* @param: app: estado atual do app
*         panel: painel de controle geral
* return: grid: painel de controle de login criado
**/
function returnControlPanelCreation(app, panel) {

  /* Variaveis do painel de controle de tentativas */
  var grid = app.createGrid(9, 2).setId('returnGrid');
  var welcomeLabel = app.createLabel().setStyleAttribute("fontSize", "14").setVisible(false).setId('returnLabel');
  var confirmButton = app.createButton('Confirmar').setVisible(false).setId('confirmButton');
  var forfeitButton = app.createButton('Desistir').setVisible(false).setId('forfeitButton');
  var infoLabel = app.createLabel().setStyleAttribute("fontSize", "14").setVisible(false).setId('infoLabel1');
  var infoLabel2 = app.createLabel().setStyleAttribute("fontSize", "14").setVisible(false).setId('infoLabel2');
  var infoLabel3 = app.createLabel().setStyleAttribute("fontSize", "14").setVisible(false).setId('infoLabel3');
  var infoLabel4 = app.createLabel().setStyleAttribute("fontSize", "14").setVisible(false).setId('infoLabel4');
  var infoLabel5 = app.createLabel().setStyleAttribute("fontSize", "14").setVisible(false).setId('infoLabel5');
  
  /* Criacao do painel de controle de tentativas */
  grid.setWidget(2, 0, confirmButton)
      .setWidget(3, 0, forfeitButton)
      .setWidget(4, 0, infoLabel)
      .setWidget(5, 0, infoLabel2)
      .setWidget(6, 0, infoLabel3)
      .setWidget(7, 0, infoLabel4)
      .setWidget(8, 0, infoLabel5);
      
  /* Criacao do tratador do botao de confirmacao */
  var triesHandler = app.createServerClickHandler('validateTry');
  triesHandler.addCallbackElement(panel);
  app.getElementById('confirmButton').addClickHandler(triesHandler);
  
  /* Criacao do tratador do botao de desistencia */
  var forfeitHandler = app.createServerClickHandler('userForfeit');
  forfeitHandler.addCallbackElement(panel);
  app.getElementById('forfeitButton').addClickHandler(forfeitHandler);
  
  return grid;
}

/**
* func: surveyControlPanelCreation
* desc: cria o painel de controle do survey
*
* @param: app: estado atual do app
*         panel: painel de controle geral
* return: grid: painel de controle do survey criado
**/
function surveyControlPanelCreation(app, panel) {

  /* Variaveis do painel de controle do survey */
  var grid = app.createGrid(9, 1).setId('surveyGrid');
  var continueLabel = app.createLabel('Para finalizar, responda as perguntas abaixo.').setStyleAttribute("fontSize", "14").setVisible(false).setId('continueLabel');
  var referenceLabel = app.createLabel('Por onde você ficou sabendo desse estudo?').setStyleAttribute("fontSize", "14").setVisible(false).setId('referenceLabel');
  var referenceListBox = app.createListBox().setName('referenceListBox').setPixelSize(200, 19).setVisible(false).setId('referenceListBoxId');
  referenceListBox.setVisibleItemCount(1);
  referenceListBox.addItem('');
  referenceListBox.addItem('Facebook');
  referenceListBox.addItem('E-mail');
  referenceListBox.addItem('Amigos');
  referenceListBox.addItem('Outro');
  
  var escolarityLabel = app.createLabel('Qual seu grau de escolaridade?').setStyleAttribute("fontSize", "14").setVisible(false).setId('escolarityLabel');
  var escolarityListBox = app.createListBox().setName('escolarityListBox').setPixelSize(200, 19).setVisible(false).setId('escolarityListBoxId');
  escolarityListBox.setVisibleItemCount(1);
  escolarityListBox.addItem('');
  escolarityListBox.addItem('1° Grau incompleto');
  escolarityListBox.addItem('1º Grau completo');
  escolarityListBox.addItem('2º Grau completo');
  escolarityListBox.addItem('Especialização ou Ensino Técnico');
  escolarityListBox.addItem('Ensino Superior completo');
  escolarityListBox.addItem('Mestrado');
  escolarityListBox.addItem('Doutorado');
  
  var wroteDownLabel = app.createLabel('Você chegou a anotar a senha atribuida em algum lugar? (online, em e-mails ou serviços de armazenamento; ou offline, em cadernos, folhas ou até mesmo arquivos no computador)').setStyleAttribute("fontSize", "14").setVisible(false).setId('wroteDownLabel');
  var wroteDownListBox = app.createListBox().setName('wroteDownListBox').setPixelSize(200, 19).setId('wroteDownListBoxId').setVisible(false);
  wroteDownListBox.setVisibleItemCount(1);
  wroteDownListBox.addItem('');
  wroteDownListBox.addItem('Não');
  wroteDownListBox.addItem('Sim, online');
  wroteDownListBox.addItem('Sim, offline');
  
  var submitButton2 = app.createButton('Submeter!').setVisible(false).setId('submitButton2');
  var thanksLabel = app.createLabel('Novamente agradecemos sua participação. Até logo!').setStyleAttribute("fontSize", "14").setVisible(false).setId('thanksLabel');
  
  /* Criacao do painel de controle do survey */
  grid.setWidget(0, 0, continueLabel)
      .setWidget(1, 0, referenceLabel)
      .setWidget(2, 0, referenceListBox)
      .setWidget(3, 0, escolarityLabel)
      .setWidget(4, 0, escolarityListBox)
      .setWidget(5, 0, wroteDownLabel)
      .setWidget(6, 0, wroteDownListBox)
      .setWidget(7, 0, submitButton2)
      .setWidget(8, 0, thanksLabel);
  
  /* Criacao do tratador do botao de submissao */
  var answersHandler = app.createServerClickHandler('submitAnswers');
  answersHandler.addCallbackElement(panel);
  answersHandler.addCallbackElement(referenceListBox);
  answersHandler.addCallbackElement(escolarityListBox);
  answersHandler.addCallbackElement(wroteDownListBox);
  app.getElementById('submitButton2').addClickHandler(answersHandler);
  
  return grid;
}

/**
* func: verifyTicket
* desc: tratador de evento (clique do usuario no botao "Submeter")
*
* @param: e: objeto evento contendo informacoes do contexto do programa que causou a ativacao
*            da funcao
* return: app: novo estado do app
**/
function verifyTicket(e) {
  var app = UiApp.getActiveApplication();
  
  /* Restauracao dos elementos de Callback */
  var ticket = e.parameter.ticket;
  var panel = e.parameter.panel;
  
  /* Abertura da planilha de controle de usuarios */
  var userSheet = SpreadsheetApp.openById(userSSKey).getActiveSheet();
  
  /* Obtencao dos dados de cadastro da planilha de controle de usuarios */
  var data = userSheet.getDataRange().getValues();
  
  /* Verificacao da existencia do ticket e chamada dos tratadores */
  for (var i = 0; i < userSheet.getLastRow(); i++) {
    if (data[i][0] == ticket) {
      app = ticketFound(app, panel, ticket, data[i][1], data[i][3], data[i][4]);
      return app;
    }
  }
  
  app = ticketNotFound(app, 1);
  return app;
}

/**
* func: ticketNotFound
* desc: exibe uma mensagem de erro para o usuario, pedindo para que este tente reinserir o ticket
*
* @param: app: estado atual do app
*         errorCode: 1 para ticket invalido, 2 para ticket ja utilizado
* return: app: novo estado do app
**/
function ticketNotFound(app, errorCode) {

  if (errorCode == 2) {
    var errorLabel = app.createLabel('Ticket já utilizado. Por favor, entre com outro.').setStyleAttribute("fontSize", "14").setId('errorLabel');
    errorLabel.setStyleAttribute('color', 'red');
  }
  
  else {
    var errorLabel = app.createLabel('Ticket inválido. Por favor, tente novamente.').setStyleAttribute("fontSize", "14").setId('errorLabel');
    errorLabel.setStyleAttribute('color', 'red');
  }
  
  app.getElementById('loginGrid').setWidget(3, 0, errorLabel);
  return app;
}

/**
* func: ticketFound
* desc: adiciona os dados do usuario na planilha de controle de respostas e libera a proxima
*       etapa do experimento
*
* @param: app: estado atual do app
*         panel: painel de controle geral
*         ticket: numero de ticket do usuario atual
*         name: nome do usuario atual
*         passphrase: senha atribuida ao usuario atual
*         dictionary: dicionario utilizado para gerar a senha
* return: app: novo estado do app
**/
function ticketFound(app, panel, ticket, name, passphrase, dictionary) {

  /* Abertura da planilha de controle de respostas */
  var answerSheet = SpreadsheetApp.openById(answerSSKey).getActiveSheet();
  
  /* Obtencao da ultima linha da planilha de controle de respostas que contem dados */
  var lastRow = answerSheet.getLastRow();
  
  /* Verificacao de se o usuario ja respondeu o formulario */
  var data = answerSheet.getDataRange().getValues();
  for (var i = 0; i < lastRow; i++) {
    if (data[i][0] == ticket) {
      app = ticketNotFound(app, 2);
      return app;
    }
  }
  
  /* Adicao dos dados do usuario em uma planilha, caso contrario */
  answerSheet.getRange(lastRow+1, 1).setValue(ticket);
  answerSheet.getRange(lastRow+1, 2).setValue(passphrase);
  answerSheet.getRange(lastRow+1, 3).setValue(dictionary);
  answerSheet.getRange(lastRow+1, 7).setValue(0);
  
  /* Remocao do botao de submissao e da mensagem de erro, se existente */
  app.getElementById('submitButton').setVisible(false);
  app.getElementById('loginGrid').resize(3, 2);
  
  /* Liberacao da proxima etapa do experimento */
  var returnLabel = app.createLabel('Bem-vindo de volta!').setStyleAttribute("fontSize", "14").setStyleAttribute('color', 'blue').setId('returnLabel');
  app.getElementById('loginGrid').setWidget(2, 0, returnLabel);
  var tryLabel = app.createLabel('Por favor, insira a senha atribuída na primeira etapa do experimento feita a poucos dias atrás: ').setStyleAttribute("fontSize", "14").setId('tryLabel');
  var tryTextBox = app.createTextBox().setWidth('300px').setName('userTry').setId('tryTextBox');
  app.getElementById('returnGrid').setWidget(0, 0, tryLabel);
  app.getElementById('returnGrid').setWidget(1, 0, tryTextBox);
  app.getElementById('confirmButton').setVisible(true);
  
  return app;
}

/**
* func: validateTry
* desc: tratador de evento (clique do usuario no botao "Confirmar")
*
* @param: e: objeto evento contendo informacoes do contexto do programa que causou a ativacao
*            da funcao
* return: app: novo estado do app
**/
function validateTry(e) {
  var app = UiApp.getActiveApplication();

  /* Restauracao dos elementos de Callback */
  var ticket = e.parameter.ticket;
  var userTry = e.parameter.userTry;
  
  /* Abertura da planilha de controle de respostas */
  var answerSheet = SpreadsheetApp.openById(answerSSKey).getActiveSheet();
  
  /* Obtencao da posicao dos dados do usuario na planilha de controle de respostas */
  var currentUserPosition = getUserPosition(ticket, answerSheet);
  
  /* Obtencao da tentativa atual do usuario */
  var tryNumber = Number(answerSheet.getRange(currentUserPosition, 7).getDisplayValue());
  
  /* Registro da tentativa atual do usuario */
  answerSheet.getRange(currentUserPosition, 4 + tryNumber).setValue(userTry);
  
  /* Obtencao da passphrase atribuida ao usuario */
  var passphrase = answerSheet.getRange(currentUserPosition, 2).getDisplayValue();
  
  /* Obtencao do vetor passphrase */
  var passphraseVector = [];
  var word = [];
  for (var i = 0, j = 0, k = 0; i <= passphrase.length; i++) {
    if (passphrase[i] === ' ' || passphrase[i] == null) {
      word = word.join("");
      passphraseVector[k++] = word;
      word = [];
      j = 0;
    }
    else {
      word[j++] = passphrase[i];
    }
  }
  
  /* Verificacao da passphrase atribuida ao usuario e chamada dos tratadores */
  var tryReport = [];
  if (verifyPassphrase(passphraseVector, userTry, tryReport) == false) {
    app = wrongTry(app, tryNumber, tryReport);
    answerSheet.getRange(currentUserPosition, 7).setValue(tryNumber+1);
    return app;
  }
  
  answerSheet.getRange(currentUserPosition, 7).setValue(tryNumber+1);
  app = correctTry(app);
  return app;
}

/**
* func: getUserPosition
* desc: retorna a posicao dos dados do usuario ativo na planilha de controle de respostas.
*       serve para casos de acesso simultaneo a planilha
*
* @param: ticket: numero de ticket do usuario atual
*         answerSheet: planilha de controle de respostas
* return: posicao dos dados do usuario ativo na planilha de controle de respostas
*         (o caso -1 nunca eh utilizado)
**/
function getUserPosition(ticket, answerSheet) {

  var data = answerSheet.getDataRange().getValues();
  
  for (var i = 0; i <= answerSheet.getLastRow(); i++) {
    Logger.log(data[i][0]);
    if (data[i][0] == ticket) {
      return i+1;
    }
  }
  
  return -1;
}

/**
* func: verifyPassphrase
* desc: verifica se uma passphrase inserida por um usuario e igual a atribuida anteriormente
*
* @param: passphraseVector: passphrase em forma de vetor de strings
*         userTry: tentativa do usuario em forma de string
*         tryReport: vetor com relatorio de letras erradas por palavra
* return: true, se for igual
*         false, se for diferente
**/
function verifyPassphrase(passphraseVector, userTry, tryReport) {
  
  /* Obtencao do vetor userTry */
  var userTryVector = [];
  var word = [];
  for (var i = 0, j = 0, k = 0; i <= userTry.length; i++) {
    if (userTry[i] === ' ' || userTry[i] == null) {
      word = word.join("");
      word = word.toLowerCase();
      userTryVector[k++] = word;
      word = [];
      j = 0;
    }
    else {
      word[j++] = userTry[i];
    }
  }
  
  /* Calculo do numero de letras erradas em cada palavra */
  tryReport[0] = 1000;
  tryReport[1] = 1000;
  tryReport[2] = 1000;
  for (var i = 0; i < userTryVector.length; i++) {
    var wordDifferences = [];
    
    for (var j = 0; j < passphraseVector.length; j++) {
      wordDifferences[j] = getDifferentChars(userTryVector[i], passphraseVector[j]);
    }
    
    if (wordDifferences[0] < wordDifferences[1] && wordDifferences[0] < wordDifferences[2]) {
      tryReport[i] = wordDifferences[0];
      passphraseVector[0] = "-";
    }
    else if (wordDifferences[1] < wordDifferences[2]) {
      tryReport[i] = wordDifferences[1];
      passphraseVector[1] = "-";
    }
    else {
      tryReport[i] = wordDifferences[2];
      passphraseVector[2] = "-";
    }
  }
  
  if (tryReport[0] == 0 && tryReport[1] == 0 && tryReport[2] == 0) {
    return true;
  }
  
  return false;
}

/**
* func: getDifferentChars
* desc: calcula o numero de caracteres diferentes entre 2 strings sem levar em
*       consideracao a ordem deles
*
* @param: string1 e string2: strings a serem verificadas 
* return: numero de caractres diferentes
**/
function getDifferentChars(string1, string2) {
  var misses = 0;
  
  if (string1.length >= string2.length) {
    for (var i = 0; i < string1.length; i++) {
      for (var j = 0, ok = 1; j < string2.length && ok === 1; j++) {
        if (string2[j] === string1[i]) {
          string2 = string2.split('');
          string2[j] = "-";
          string2 = string2.join('');
          ok = 0;
        }
      }
      misses += ok;
    }
  }
  
  else {
    for (var i = 0; i < string2.length; i++) {
      for (var j = 0, ok = 1; j < string1.length && ok === 1; j++) {
        if (string1[j] === string2[i]) {
          string1 = string1.split('');
          string1[j] = "-";
          string1 = string1.join('');
          ok = 0;
        }
      }
      misses += ok;
    }
  }
  
  return misses;
}

/**
* func: wrongTry
* desc: exibe uma mensagem de erro caso o usuario insira a senha errada, bloqueando
*       as tenatativas caso o erro persista e desbloqueando a proxima etapa do experimento
*
* @param: app: estado atual do app
*         tryNumber: tentativa atual do usuario
* return: app: novo estado do app
**/
function wrongTry(app, tryNumber, tryReport) {
  
  if (tryNumber < 2) {
    /* Exibicao da mensagem de erro */
    app.getElementById('forfeitButton').setVisible(true);
    app.getElementById('infoLabel1').setText('Senha incorreta. Por favor, tente novamente. (Restantes: ' + (2-tryNumber) + ')');
    app.getElementById('infoLabel1').setVisible(true).setStyleAttribute('color','red');
    
    if (tryReport[1] == 1000) {
      app.getElementById('infoLabel2').setText('Você inseriu apenas uma palavra (a senha contém 3).');
      app.getElementById('infoLabel2').setVisible(true).setStyleAttribute('color','red');
      app.getElementById('infoLabel3').setText('Caso você não se lembre da senha, clique em "Desistir!".');
      app.getElementById('infoLabel3').setVisible(true);
    }
    
    else if (tryReport[2] == 1000) {
      app.getElementById('infoLabel2').setText('Você inseriu apenas duas palavras (a senha contém 3).');
      app.getElementById('infoLabel2').setVisible(true).setStyleAttribute('color','red');
      app.getElementById('infoLabel3').setText('Caso você não se lembre da senha, clique em "Desistir!".');
      app.getElementById('infoLabel3').setVisible(true);
    }
    
    else {
      app.getElementById('infoLabel2').setText('Caso você não se lembre da senha, clique em "Desistir!".');
      app.getElementById('infoLabel2').setVisible(true).setStyleAttribute('color','black');
      app.getElementById('infoLabel3').setVisible(false);
    }
    
    return app;
  }
  
  /* Exibicao da mensagem de agradecimento e desbloqueio da proxima etapa */
  app.getElementById('confirmButton').setVisible(false);
  app.getElementById('forfeitButton').setVisible(false);
  var thanksLabel = app.createLabel('Obrigado pela participação!').setStyleAttribute("fontSize", "14");
  thanksLabel.setStyleAttribute('color', 'blue');
  app.getElementById('returnGrid').setWidget(1, 0, thanksLabel);
  app.getElementById('returnGrid').resize(2, 2);
  activateSurvey(app);
  
  return app;
}

/**
* func: correctTry
* desc: exibe uma mensagem de sucesso caso o usuario insira a senha correta, desbloqueando
*       a proxima etapa do experimento
*
* @param: app: estado atual do app
* return: app: novo estado do app
**/
function correctTry(app) {

  /* Exibicao da mensagem de agradecimento e desbloqueio da proxima etapa */
  app.getElementById('confirmButton').setVisible(false);
  app.getElementById('forfeitButton').setVisible(false);
  var correctLabel = app.createLabel('Senha correta!').setStyleAttribute("fontSize", "14");
  correctLabel.setStyleAttribute('color', 'green');
  var thanksLabel = app.createLabel('Obrigado pela participação!').setStyleAttribute("fontSize", "14");
  thanksLabel.setStyleAttribute('color', 'green');
  app.getElementById('returnGrid').setWidget(1, 0, correctLabel);
  app.getElementById('returnGrid').setWidget(2, 0, thanksLabel);
  app.getElementById('returnGrid').resize(3, 2);
  activateSurvey(app);
  
  return app;
}

/**
* func: userFofeit
* desc: tratador de evento (clique do usuario no botao "Desistir!")
*
* @param: e: objeto evento contendo informacoes do contexto do programa que causou a ativacao
*            da funcao
* return: app: novo estado do app
**/
function userForfeit(e) {
  var app = UiApp.getActiveApplication();

  /* Restauracao dos elementos de Callback */
  var ticket = e.parameter.ticket;
  
  /* Abertura da planilha de controle de respostas */
  var answerSheet = SpreadsheetApp.openById(answerSSKey).getActiveSheet();
  
  /* Obtencao da posicao dos dados do usuario na planilha de controle de respostas */
  var currentUserPosition = getUserPosition(ticket, answerSheet);
  
  /* Obtencao da tentativa atual do usuario */
  var tryNumber = Number(answerSheet.getRange(currentUserPosition, 7).getDisplayValue());
  
  /* Registro da tentativa atual do usuario */
  answerSheet.getRange(currentUserPosition, 4 + tryNumber).setValue('DESISTIU');

  /* Exibicao da mensagem de agradecimento e desbloqueio da proxima etapa */
  app.getElementById('confirmButton').setVisible(false);
  app.getElementById('forfeitButton').setVisible(false);
  var thanksLabel = app.createLabel('Obrigado pela participação!').setStyleAttribute("fontSize", "14");
  thanksLabel.setStyleAttribute('color', 'green');
  app.getElementById('returnGrid').setWidget(1, 0, thanksLabel);
  app.getElementById('returnGrid').resize(2, 2);
  activateSurvey(app);
  
  return app;
}

/**
* func: activateSurvey
* desc: desbloqueia a proxima etapa do experimento
*
* @param: app: estado atual do app
* return: app: novo estado do app
**/
function activateSurvey(app) {

  app.getElementById('continueLabel').setVisible(true);
  app.getElementById('referenceLabel').setVisible(true);
  app.getElementById('referenceListBoxId').setVisible(true);
  app.getElementById('escolarityLabel').setVisible(true);
  app.getElementById('escolarityListBoxId').setVisible(true);
  app.getElementById('wroteDownLabel').setVisible(true);
  app.getElementById('wroteDownListBoxId').setVisible(true);
  app.getElementById('submitButton2').setVisible(true);

  return app;
}

/**
* func: submitAnswers
* desc: tratador de evento (clique do usuario no botao "Submeter!") 
*
* @param: e: objeto evento contendo informacoes do contexto do programa que causou a ativacao
*            da funcao
* return: app: novo estado do app
**/
function submitAnswers(e) {
  var app = UiApp.getActiveApplication();
  
  /* Restauracao dos elementos de Callback */
  var ticket = e.parameter.ticket;
  var reference = e.parameter.referenceListBox;
  var escolarity = e.parameter.escolarityListBox;
  var wroteDown = e.parameter.wroteDownListBox;
  
  /* Abertura da planilha de controle de respostas */
  var answerSheet = SpreadsheetApp.openById(answerSSKey).getActiveSheet();
  
  /* Obtencao da posicao dos dados do usuario na planilha de controle de respostas */
  var currentUserPosition = getUserPosition(ticket, answerSheet);
  
  /* Adicao das respostas do usuario na planilha de controle de respostas */
  answerSheet.getRange(currentUserPosition, 8).setValue(reference);
  answerSheet.getRange(currentUserPosition, 9).setValue(escolarity);
  answerSheet.getRange(currentUserPosition, 10).setValue(wroteDown);
  
  /* Exibicao de outra mensagem de agradecimento e finalizacao do experimento */
  app.getElementById('submitButton2').setVisible(false);
  app.getElementById('thanksLabel').setVisible(true).setStyleAttribute('color','blue');
  
  return app;
}
