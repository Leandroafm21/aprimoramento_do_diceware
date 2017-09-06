/* 
 * Criador: Leandro Augusto Fernandes de Magalhães
 *          Instituto de Computação da Unicamp (IC-UNICAMP)
 *
 * Descrição: Este script tem por objetivo automatizar o envio de e-mails para participantes do
 *            projeto de iniciação científica "Aprimoramento do Método Diceware e tradução para o
 *            Português", orientado pelo professor Diego de Freitas Aranha.
 *
 * Observações: 1-) Este script deve ser acoplado a uma Planilha Google (Google Spreadsheet).
                2-) Este script não funciona para casos em que a data de retorno ocorre em um mês
                    diferente a data de cadastro.
 */


function sendEmails() {

  /* Abertura da Planilha */
  var sheet = SpreadsheetApp.getActiveSheet();
  
  /* Obtenção dos dados da Planilha */
  var data = sheet.getDataRange().getValues();
  
  /* Obtenção do valor numérico da última linha que contém dados */
  var lastRow = sheet.getLastRow();
  
  /* Obtenção da data atual */
  var date = new Date();
  
  /* Atribuição do intervalo de retorno */
  var returnDays = 2;
  
  /* Loop: Envia e-mail requisitando a volta para todos os usuários que se cadastraram a mais de
   *       'returnDays' dias. */
  for (var i = 1; i < lastRow; i++) {
  
    /* Obtenção do dia de cadastro de um usuário */
    var registrationDay = parseInt(data[i][5][0] + data[i][5][1], 10);
    
    /* Obtenção do ticket de cadastro do usuário */
    var ticket = data[i][0];
    
    /* Verificação para envio de e-mails */
    if (date.getDate() - registrationDay >= returnDays && data[i][6] === 'não') {
    
      /* Assunto do e-mail */
      var subject = 'Prossiga com o experimento do Diceware em Português';
      
      /* Corpo do e-mail */
      var body = 'Prezado(a) ' + data[i][1] + ',\n'
                    + 'Novamente gostaríamos de agradecer pela sua participação no experimento "Aprimoramento do '
                    + 'método Diceware e tradução para o Português".\n\n'
                    + 'O número do seu ticket é ' + ticket + '.\n\n'
                    + 'Para prosseguir, acesse o link abaixo e siga as instruções. É bem rápido!\n'
                    + 'https://sites.google.com/site/dicewarebrasileiro/retorno\n\n'
                    + 'Até logo!\n\n'
                    + 'obs. Se você acha que não deveria estar recebendo este e-mail, apenas o ignore.';
                    + 'obs 2. Seu retorno é importante mesmo se você não lembrar a senha! Possuímos um botão para '
                    + 'desistência após 1 tentativa nesse caso.'
                    
      /* Envio do e-mail */
      MailApp.sendEmail(data[i][2], subject, body);
      
      /* Alteração da variável de controle de envios */
      sheet.getRange(i+1, 7).setValue('sim');
    }
    
  }
  
}
