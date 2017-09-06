/* 
 * Criador: Leandro Augusto Fernandes de Magalhães
 *          Instituto de Computação da Unicamp (IC-UNICAMP)
 *
 * Descrição: Este script tem por objetivo criar um web-app que consiste em um painel destinado ao
 *            cadastro de usuarios. Contém 2 caixas de texto para a inserção do nome e e-mail do
 *            usuário, e, se os dados forem válidos, exibe uma passphrase gerada aleatoriamente
 *            com base em uma lista de palavras (contida em uma Planilha Google) e uma mensagem de
 *            agradecimento. Senão, exibe uma mensagem de erro.
 *
 * Observações: 1-) Este script deve ser acoplado a um Site Google.
 */

/* Chave para a(s) planilha(s) contendo as palavras do dicionario a ser testado */
var selectedSSKey = '1e8D5hvE4hIeWl5VGQYgkdTg_E9lBLSFmg0THQWUEAoY';
var selectedEnglishSSKey = '1_ooRLZxPYCXWtqvpfsLHLkOhIBId0VmFEHLZk91JKRM';

/* Chave para a planilha contendo os usuarios participantes */
var userSSKey = '1yRiYsHw360rmr2_99AAeyuI0CqSs61trcGOkLY1e__k';

/* Dicionario utilizado para a geracao da senha */
var dictionary = [];

function doGet() {
  var app = UiApp.createApplication().setTitle('myApp');
  
  /* Criacao do painel de controle geral do experimento */
  var panel = app.createVerticalPanel();
  
  /* Criacao do painel de controle de usuarios */
  var userGrid = userControlPanelCreation(app);
  
  /* Criacao do painel de controle de submissoes */
  var submissionGrid = submissionControlPanelCreation(app, panel);
  
  /* Adicao do painel de controle de usuarios */
  panel.add(userGrid);
  
  /* Adicao do painel de controle de submissoes */
  panel.add(submissionGrid);
  
  /* Adicao do painel de controle geral */
  app.add(panel);
  
  return app;
}

/**
* func: userControlPanelCreation
* desc: cria o painel de controle de usuarios
*
* @param: app: estado atual do app
* return: grid: painel de controle de usuarios criado
**/
function userControlPanelCreation(app) {

  var grid = app.createGrid(2, 2).setId('userGrid');
  var nameLabel = app.createLabel('Insira seu nome completo: ').setStyleAttribute("fontSize", "14");
  var nameTextBox = app.createTextBox().setWidth('300px').setName('nome');
  var emailLabel = app.createLabel('Insira seu e-mail: ').setStyleAttribute("fontSize", "14");
  var emailTextBox = app.createTextBox().setWidth('300px').setName('email');
  
  grid.setWidget(0, 0, nameLabel)
      .setWidget(0, 1, nameTextBox)
      .setWidget(1, 0, emailLabel)
      .setWidget(1, 1, emailTextBox);
  
  return grid;
}

/**
* func: submissionControlPanelCreation
* desc: cria o painel de controle de submissoes e o botao de submissoes, alem do seu tratador
*       do tipo ClickHandler
*
* @param: app: estado atual do app
*         panel: painel de controle geral do experimento
* return: grid: painel de controle de submissoes criado
**/
function submissionControlPanelCreation(app, panel) {

  /* Variaveis do painel de controle de submissoes */
  var grid = app.createGrid(6, 1).setId('submissionGrid');
  var submitButton = app.createButton('Submeter!').setId('submitButton');
  var infoLabel = app.createLabel().setStyleAttribute("fontSize", "14").setVisible(false).setId('infoLabel1');
  var infoLabel2 = app.createLabel().setStyleAttribute("fontSize", "14").setVisible(false).setId('infoLabel2');
  var passphraseLabel = app.createLabel().setStyleAttribute("fontSize", "18").setVisible(false).setId('passphraseLabel');
  var infoLabel3 = app.createLabel().setStyleAttribute("fontSize", "14").setVisible(false).setId('infoLabel3');
  var infoLabel4 = app.createLabel().setStyleAttribute("fontSize", "14").setVisible(false).setId('infoLabel4');
  
  /* Criacao do painel de controle de submissoes */
  grid.setWidget(0, 0, submitButton)
      .setWidget(1, 0, infoLabel)
      .setWidget(2, 0, infoLabel2)
      .setWidget(3, 0, passphraseLabel)
      .setWidget(4, 0, infoLabel3)
      .setWidget(5, 0, infoLabel4);
      
  /* Criacao do tratador do botao de submissao */
  var submissionHandler = app.createServerClickHandler('submitUser');
  submissionHandler.addCallbackElement(panel);
  submitButton.addClickHandler(submissionHandler);
  
  return grid;
}

/**
* func: submitUser
* desc: tratador de evento (clique do usuario no botao "submeter")
*
* @param: e: objeto evento contendo informacoes do contexto do programa que causou a ativacao
*            da funcao
* return: app: novo estado do app
**/
function submitUser(e) {
  var app = UiApp.getActiveApplication();
  
  /* Restauracao dos elementos de Callback */
  var name = e.parameter.nome;
  var email = e.parameter.email;
  var panel = e.parameter.panel;
  
  /* Abertura da planilha de controle de usuarios */
  var userSheet = SpreadsheetApp.openById(userSSKey).getActiveSheet();
  
  /* Tratamento dos erros de nome/e-mail */
  var test = errorHandlers(app, name, email, userSheet);
  if (test === 1) {
    return app;
  }
  
  app.getElementById('infoLabel1').setVisible(false);
  app.getElementById('infoLabel2').setVisible(false);
  
  /* Geracao da passphrase */
  var passphrase = generatePassphrase(dictionary);
  var passphraseString = passphrase[0] + ' ' + passphrase[1] + ' ' + passphrase[2];
  
  /* Continuacao do codigo normal, em caso de dados corretos */
  app = registerFinalization(app, name, email, userSheet, passphraseString, dictionary);
  
  return app;
}

/**
* func: errorHandlers
* desc: verifica se o nome ou e-mail inserido pelo usuario contem erros, alterando
*       as mensagens mostradas pelo app em diferentes tipos de falhas
*
* @param: app: estado atual do aplicativo
*         name: nome inserido pelo usuario
*         email: e-mail inserido pelo usuario
*         userSheet: planilha de controle de usuarios cadastrados
* return: 0, caso nao haja erros
*         1, caso haja erros
**/
function errorHandlers(app, name, email, userSheet) {

  /* Obtencao da ultima linha da planilha de controle de usuarios que contem dados */
  var lastRow = userSheet.getLastRow();

 /* Tratamento dos erros de nome/e-mail invalidos */
 if (!nameChecker(name) && !emailChecker(email)) {
    app.getElementById('infoLabel1').setText('Erro: nome e e-mail inválidos.');
    app.getElementById('infoLabel2').setText('Corrija os campos e clique novamente em "submeter".');
    app.getElementById('infoLabel1').setVisible(true).setStyleAttribute('color','red');
    app.getElementById('infoLabel2').setVisible(true).setStyleAttribute('color', 'red');
    return 1;
  }
  
  /* Tratamento do erro de e-mail ja cadastrado */
  var data = userSheet.getDataRange().getValues();
  for (var i = 0; i < lastRow; i++) {
    if (data[i][2] === email) {
      app.getElementById('infoLabel1').setText('Erro: e-mail "' + email + '" já cadastrado.');
      app.getElementById('infoLabel2').setText('Insira um novo e-mail e clique novamente em "submeter".');
      app.getElementById('infoLabel1').setVisible(true).setStyleAttribute('color','red');
      app.getElementById('infoLabel2').setVisible(true).setStyleAttribute('color', 'red');
      return 1;
    }
  }
  
  /* Tratamento do erro de nome invalido */
  if (!nameChecker(name)) {
    app.getElementById('infoLabel1').setText('Erro: nome inválido.');
    app.getElementById('infoLabel2').setText('Corrija o nome e clique novamente em "submeter".');
    app.getElementById('infoLabel1').setVisible(true).setStyleAttribute('color','red');
    app.getElementById('infoLabel2').setVisible(true).setStyleAttribute('color', 'red');
    return 1;
  }
  
  /* Tratamento do erro de e-mail invalido */
  if (!emailChecker(email)) {
    app.getElementById('infoLabel1').setText('Erro: e-mail inválido.');
    app.getElementById('infoLabel2').setText('Corrija o e-mail e clique novamente em "submeter".');
    app.getElementById('infoLabel1').setVisible(true).setStyleAttribute('color','red');
    app.getElementById('infoLabel2').setVisible(true).setStyleAttribute('color', 'red');
    return 1;
  }
  
  return 0;
}

/**
* func: generatePassphrase
* desc: gera uma passphrase aleatoria baseada em uma lista de palavras pre-estabelecida
*
* @param: none
* return: passphrase: vetor de strings contendo as palavras da passphrase
**/
function generatePassphrase() {

  var sheet;
  
  if (Math.floor(Math.random() * 4) == 0) {
    sheet = SpreadsheetApp.openById(selectedEnglishSSKey).getActiveSheet();
    dictionary = "Selecionadas Inglês";
  }
  else {
    sheet = SpreadsheetApp.openById(selectedSSKey).getActiveSheet();
    dictionary = "Selecionadas Português";
  }
  
  var passphrase = [];
  var data = sheet.getDataRange().getValues();
  
  for (var i = 0; i < 3; i++) {
    var k = Math.floor(Math.random() * (sheet.getLastRow()+1));
    passphrase[i] = data[k][0];
  }
  
  Logger.log(passphrase);

  return passphrase;
}

/**
* func: registerFinalization
* desc: completa o registro, mostrando uma mensagem de agradecimento e adicionando os dados do
*       usuario em uma planilha
*
* @param: app: estado atual do aplicativo
*         name: nome inserido pelo usuario
*         email: e-mail inserido pelo usuario
*         userSheet: planilha de controle de usuarios cadastrados
*         passphraseString: passphrase gerada
* return: app: novo estado do aplicativo
**/
function registerFinalization(app, name, email, userSheet, passphraseString) {

  /* Obtencao da ultima linha da planilha de controle de usuarios que contem dados */
  var lastRow = userSheet.getLastRow();

  /* Obtencao da data de cadastro */
  var date = new Date();
  
  /* Conversoes da data de cadastro e hora de cadastro para strings */
  var dateString = (Array(3).join('0') + date.getDate()).slice(-2) + '/' + (Array(3).join('0') + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear();
  
  /* Adicao da mensagem de agradecimento */
  var successfulLabel = app.createLabel().setStyleAttribute("fontSize", "14").setStyleAttribute('color', 'green').setId('infoLabel1');
  app.getElementById('submissionGrid').setWidget(0, 0, successfulLabel);
  app.getElementById('infoLabel1').setText('Obrigado pela participação!');
  app.getElementById('infoLabel2').setText('Sua senha é:');
  app.getElementById('passphraseLabel').setText(passphraseString);
  app.getElementById('infoLabel3').setText('Dentro de alguns dias você receberá um e-mail com as instruções');
  app.getElementById('infoLabel4').setText('para o retorno.');
  app.getElementById('infoLabel1').setVisible(true).setStyleAttribute('color','green');
  app.getElementById('infoLabel2').setVisible(true).setStyleAttribute('color', 'green');
  app.getElementById('passphraseLabel').setVisible(true);
  app.getElementById('infoLabel3').setVisible(true).setStyleAttribute('color', 'green');
  app.getElementById('infoLabel4').setVisible(true).setStyleAttribute('color', 'green');
  
  /* Remocao do botao de submissao */
  app.getElementById('submitButton').setVisible(false);
  
  /* Geracao de um ticket de cadastro */
  var ticket = Math.floor(Math.random() * 1000000);
  
  /* Adicao dos dados do usuario em uma planilha */
  userSheet.getRange(lastRow+1, 1).setValue(ticket);
  userSheet.getRange(lastRow+1, 2).setValue(name);
  userSheet.getRange(lastRow+1, 3).setValue(email);
  userSheet.getRange(lastRow+1, 4).setValue(passphraseString);
  userSheet.getRange(lastRow+1, 5).setValue(dictionary);
  userSheet.getRange(lastRow+1, 6).setValue(dateString);
  userSheet.getRange(lastRow+1, 7).setValue('não');

  return app;
}

/**
* func: nameChecker
* desc: verifica se um nome inserido por um usuario eh valido
*
* @param: name: nome a ser verificado
* return: true, se for valido
*         false, se nao for
**/
function nameChecker(name) {
  if (name.length < 3) {
    return false;
  }
  
  for (var i = 0; i < name.length; i++) {
    if (typeof name[i] === 'number') {
      return false;
    }
  }
  return true;
}

/**
* func: emailChecker
* desc: verifica se um e-mail inserido por um usuario eh valido
*
* @param: email: e-mail a ser verificado
* return: true, se for valido
*         false, se nao for
**/
function emailChecker(email) {
  var at = false;
  var dot = false;
  
  /* Verifica se o e-mail eh valido */
  for (var i = 0; i < email.length; i++) {
    if (email[i] === '@') {
      at = true;
    }
    if (email[i] === '.') {
      dot = true;
    }
  }
  
  return at && dot;
}
