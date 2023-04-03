window.addEventListener('load',montaTabela);


function calculaData(data){
    for(var i = 0; i < 2; i++){
        data = data.replace("-","");
    }

    var dataHoje = new Date();
    var dia = dataHoje.getDate();
    var mes = dataHoje.getMonth() + 1;
    var ano = dataHoje.getFullYear();
    
    dia = dia.toString();
    mes = mes.toString();
    
    if(dia.length == 1){
        dia = '0' + dia;
    }
    if(mes.length == 1){
        mes = '0' + mes;
    }

    var dataCompleta = ano + '-' + mes + '-' + dia;
    for(var i = 0; i < 2; i++){
        dataCompleta = dataCompleta.replace("-","");
    }

    data = parseInt(data);
    dataCompleta = parseInt(dataCompleta);


    if((dataCompleta - data) <= -1){
        document.getElementById('idData').value='';
        alert('DATA INVALIDA !');
    }
}

function testaCpf(strCPF) {
    var Soma;
    var Resto;
    Soma = 0;
    if (strCPF == "00000000000") return false;

    for (i=1; i<=9; i++) Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (11 - i);
    Resto = (Soma * 10) % 11;

    if ((Resto == 10) || (Resto == 11))  Resto = 0;
    if (Resto != parseInt(strCPF.substring(9, 10)) ) return false;

    Soma = 0;
    for (i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (12 - i);
    Resto = (Soma * 10) % 11;

    if ((Resto == 10) || (Resto == 11))  Resto = 0;
    if (Resto != parseInt(strCPF.substring(10, 11) ) ) return false;
    return true;
}

function validaCpf(cpf){
    cpf = cpf.replace('.','');
    cpf = cpf.replace('.','');
    cpf = cpf.replace('-','');
    if(!testaCpf(cpf)){
        alert('CPF INVALIDO');
        document.getElementById('idCpf').value = '';
    }

}

function meu_callback(conteudo) {
    if (!("erro" in conteudo)) {
        //Atualiza os campos com os valores.
        document.getElementById('idLagradouro').value=(conteudo.logradouro);
        document.getElementById('idBairro').value=(conteudo.bairro);
        document.getElementById('idCidade').value=(conteudo.localidade);
        document.getElementById('idUf').value=(conteudo.uf);
    } //end if.
    else {
        //CEP não Encontrado.
        limpa_formulário_cep();
        alert("CEP não encontrado.");
    }
}


function pesquisacep(valor) {

    //Nova variável "cep" somente com dígitos.
    var cep = valor.replace(/\D/g, '');

    //Verifica se campo cep possui valor informado.
    if (cep != "") {

        //Expressão regular para validar o CEP.
        var validacep = /^[0-9]{8}$/;

        //Valida o formato do CEP.
        if(validacep.test(cep)) {

            //Preenche os campos com "..." enquanto consulta webservice.
            document.getElementById('idLagradouro').value="...";
            document.getElementById('idBairro').value="...";
            document.getElementById('idCidade').value="...";
            document.getElementById('idUf').value="...";

            //Cria um elemento javascript.
            var script = document.createElement('script');

            //Sincroniza com o callback.
            script.src = 'https://viacep.com.br/ws/'+ cep + '/json/?callback=meu_callback';

            //Insere script no documento e carrega o conteúdo.
            document.body.appendChild(script);

        } //end if.
        else {
            //cep é inválido.
            limpa_formulário_cep();
            alert("Formato de CEP inválido.");
        }
    } //end if.
    else {
        //cep sem valor, limpa formulário.
        limpaForm();
    }
};


function limpaForm(){
    document.getElementById('idNome').value = "";
    document.getElementById('idSobreNome').value= "";
    document.getElementById('idRg').value = "";
    document.getElementById('idCpf').value = "";
    document.getElementById('idSexo').value = "";
    document.getElementById('idData').value = "";
    document.getElementById('idCep').value = "";
    document.getElementById('idBairro').value = "";
    document.getElementById('idCidade').value = "";
    document.getElementById('idLagradouro').value = "";
    document.getElementById('idNumero').value = "";
    document.getElementById('idUf').value = "";
    document.getElementById('idComplemento').value = "";
    document.getElementById('idRadio1').checked = false;
    document.getElementById('idRadio2').checked = false;
    document.getElementById('idRadio3').checked = false;
}

function formatar(mascara, documento){
    let i = documento.value.length;
    let saida = mascara.substring(0,1);
    let texto = mascara.substring(i);

    if(texto.substring(0,1) != saida){
        documento.value += texto.substring(0,1);
    }
}

// banco de dados 

var db = openDatabase('mydb', '1.0', 'cadastro', 2 * 1024 * 1024);

db.transaction(function (tx){
    tx.executeSql('CREATE TABLE IF NOT EXISTS CADASTRO (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, nome TEXT, sobrenome TEXT, rg TEXT, cpf TEXT, sexo TEXT, data TEXT, civil TEXT, cep TEXT, lagradouro TEXT, bairro TEXT, numero TEXT, cidade TEXT, uf TEXT, complemento TEXT )')
}); 

function insere(){
    var nome = document.getElementById('idNome').value;
    var sobrenome= document.getElementById('idSobreNome').value;
    var rg = document.getElementById('idRg').value;
    var cpf = document.getElementById('idCpf').value;
    var sexo = document.getElementById('idSexo').value;
    var cep = document.getElementById('idCep').value;
    var bairro = document.getElementById('idBairro').value;
    var cidade = document.getElementById('idCidade').value;
    var lagradouro = document.getElementById('idLagradouro').value;
    var numero = document.getElementById('idNumero').value;
    var uf = document.getElementById('idUf').value;
    var complemento = document.getElementById('idComplemento').value;
    var civil = document.querySelector('input[name="civil"]:checked').value;
    var data = document.getElementById('idData').value;
    var dia = data.substring(8,10);
    var mes = data.substring(5,7);
    var ano = data.substring(0,4);
    data = `${dia}/${mes}/${ano}`;


    
    db.transaction(function(tx) {
        tx.executeSql('INSERT INTO CADASTRO (nome, sobrenome, rg, cpf, sexo, data, civil, cep, lagradouro, bairro, numero, cidade, uf, complemento) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)',[nome, sobrenome, rg, cpf, sexo, data, civil, cep, lagradouro, bairro, numero, cidade, uf, complemento],);
    });
    montaTabela();
}

function montaTabela(){
    var tabela = document.getElementById('corpoTabela');

    db.transaction(function(tx){
        tx.executeSql('SELECT * FROM CADASTRO' , [], function(tx,resultado) {
            var rows = resultado.rows;
            var tr = '';
            for(var i = 0; i < rows.length; i++){
                tr += '<tr>';
                tr += '<td>' + rows[i].nome +'</td>';
                tr += '<td>' + rows[i].sobrenome +'</td>';
                tr += '<td>' + rows[i].rg +'</td>';
                tr += '<td>' + rows[i].cpf +'</td>';
                tr += '<td>' + rows[i].sexo +'</td>';
                tr += '<td>' + rows[i].data +'</td>';
                tr += '<td>' + rows[i].civil +'</td>';
                tr += '<td>' + rows[i].cep +'</td>';
                tr += '<td>' + rows[i].lagradouro +'</td>';
                tr += '<td>' + rows[i].bairro +'</td>';
                tr += '<td>' + rows[i].numero +'</td>';
                tr += '<td>' + rows[i].cidade +'</td>';
                tr += '<td>' + rows[i].uf +'</td>';
                tr += '<td>' + rows[i].complemento +'</td>';
                tr += '</tr>';
            }

            tabela.innerHTML = tr;
        });
    },null);
}

