/* 
 * Criador: Leandro Augusto Fernandes de Magalhães
 *          Instituto de Computação da Unicamp (IC-UNICAMP)
 *
 * Descrição: Este script tem por objetivo gerar uma planilha contendo os dados das
 *            duas etapas de uma fase do experimento de forma compilada.
 *
 * Observações: 1-) Este script deve ser acoplado a uma Planilha Google (Google Spreadsheet).
 */

/* Chaves das planilhas das duas etapas */
var userSSkey = '1yRiYsHw360rmr2_99AAeyuI0CqSs61trcGOkLY1e__k';
var answerSSkey = '12zWLiHMcCbgVNyHZHn2-FPONlyG1HP8IIqIfdPTfwis';

function generateSheet() {
  
  /* Abertura das planilhas e obtencao de seus dados */
  var sheet = SpreadsheetApp.getActiveSheet();
  var userSheet = SpreadsheetApp.openById(userSSkey).getActiveSheet();
  var answerSheet = SpreadsheetApp.openById(answerSSkey).getActiveSheet();
  var userData = userSheet.getDataRange().getValues();
  var answerData = answerSheet.getDataRange().getValues();
  
  /* Criacao do vetor contendo usuarios que nao voltaram para a segunda etapa */
  var departedUser;
  var departedUsers = [ ];
  
  /* Geracao da Planilha */
  for (var i = 1, k = 0; i < userSheet.getLastRow(); i++) {
    var lastRow = sheet.getLastRow();
    departedUser = true;
    
    for (var j = 1; j < answerSheet.getLastRow(); j++) {
      if (userData[i][0] == answerData[j][0] && userData[i][0] != ' ') {
        departedUser = false;
        sheet.getRange(lastRow+1, 1).setValue(userData[i][0]);
        sheet.getRange(lastRow+1, 2).setValue(userData[i][1]);
        sheet.getRange(lastRow+1, 3).setValue(answerData[j][1]);
        sheet.getRange(lastRow+1, 4).setValue(answerData[j][2]);
        sheet.getRange(lastRow+1, 5).setValue(answerData[j][3]);
        sheet.getRange(lastRow+1, 6).setValue(answerData[j][4]);
        sheet.getRange(lastRow+1, 7).setValue(answerData[j][5]);
        sheet.getRange(lastRow+1, 8).setValue(userData[i][2]);
        sheet.getRange(lastRow+1, 9).setValue(answerData[j][7]);
        sheet.getRange(lastRow+1, 10).setValue(answerData[j][8]);
        sheet.getRange(lastRow+1, 11).setValue(answerData[j][9]);
      }
    }
    
    if (departedUser == true) {
      departedUsers[k] = "Nome: " + userData[i][1] + " E-mail: " + userData[i][2];
      k++;
    }
  }
  
  Logger.log(departedUsers);
}

/* Utilizada apenas na ultima fase. */
function sendEmails() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var data = sheet.getDataRange().getValues();
  var lastRow = sheet.getLastRow();
  
  var subject = "Formulário sobre sua participação no experimento Diceware em Português - IMPORTANTE";
  var body = "Prezado(a),\n\n" +
             "Primeiramente gostaríamos de agradecer sua participação completa no experimento \"Aprimoramento do método Diceware e tradução para o Português\".\n\n" +
             "Com o objetivo de melhorar nossos resultados obtidos, estamos te enviando um formulário bem simples (apenas 3 perguntas). Sua resposta será de extrema importância para nós!\n\n" +
             "O link é: https://goo.gl/forms/ctwr9CCEsQZz8s1n1\n\n" +
             "Obrigado pela atenção!";
  
  for (var i = 1; i < lastRow; i++) {
    MailApp.sendEmail(data[i][7], subject, body);
  }
}
