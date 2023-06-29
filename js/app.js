// ===== JS / JQUERY =====

//Quando o documento estiver ok, todo carregado, vamos criar uma função.
$(document).ready(function () {
  cardapio.eventos.init();
});

//Variável cardápio onde vamos manipular todo o objeto.
let cardapio = {};
let meuCarrinho = [];
let valorCarrinho = 0;
let valorEntrega = 5;
let meuEndereco = null

//Eventos do cardapio.
cardapio.eventos = {
  init: () => {

    cardapio.metodos.obterItensCardapio();

  },
};

//Métodos do cardápio
cardapio.metodos = {
  //Obtem a lista de itens do cardápio.
  obterItensCardapio: (categoria = 'burgers', vermais = false) => {
   
    let filtro = MENU[categoria];

        if(!vermais) {
          $("#itensCardapio").html('')
          $("#btnVerMais").removeClass('hidden');
        }
    
    $.each(filtro, (i, e) => {

        let temp = cardapio.templates.item
          //.replace vai substituir o item do template para o item atual do json.
            .replace(/\${img}/g, e.img)
            .replace(/\${name}/g, e.name)
          //toFixed(2).replace('.', ',') coloca o valor para ter duas casas decimais depois da virgula e altera de . para ,.
            .replace(/\${price}/g, e.price.toFixed(2).replace('.', ','))
          //Aumenta e diminui a quantidade dos item.
            .replace(/\${id}/g, e.id)

        //Informamos o "vermais" como variável como falsa acima, assim que clicar no "Ver mais da página vai me trazer os 4 ultimos itens.
        //Botão "Ver mais" foi clicado (12 itens)
        if(vermais && i >= 8 && i < 12) {
          $("#itensCardapio").append(temp)
        }

        //Paginação inicial (8 itens)
        if(!vermais && i < 8) {
          $("#itensCardapio").append(temp)
        }
        
    })

    // Remove o ativo
    $(".container-menu a").removeClass('active');

    //Seta o menu para ativo
    $("#menu-" + categoria).addClass('active')

  },

  //Clique no botão de Ver mais.
  verMais: () => {
    
    // event.preventDefault();

    let ativo = $(".container-menu a.active").attr('id').split('menu-')[1]
    cardapio.metodos.obterItensCardapio(ativo, true);

    $("#btnVerMais").addClass('hidden');
  },

  //Diminuir quantidade no cardápio.
  diminuirQuantidade: (id) => {

    let qntdAtual = parseInt($("#qntd-" + id).text());

    if(qntdAtual > 0) {
      $("#qntd-" + id).text(qntdAtual - 1)

    }

  },

  //Aumentar quantidade no cardápio.
  aumentarQuantidade: (id) => {
    
    let qntdAtual = parseInt($("#qntd-" + id).text());
    $("#qntd-" + id).text(qntdAtual + 1)

  },

  //Adicionar ao carrinho o item do cardápio.
  adicionarAoCarrinho: (id) => {
    
    let qntdAtual = parseInt($("#qntd-" + id).text());

    if(qntdAtual > 0) {
      
      //Obter a categoria ativa.
      let categoria = $(".container-menu a.active").attr('id').split('menu-')[1]

      //Obter a lista de itens.
      let filtro = MENU[categoria]

      //Obter o item.
      let item = $.grep(filtro, (e, i) => { return e.id == id })

      if(item.length > 0) {

        //Validar se já existe esse item no carrinho.
        let existe = $.grep(meuCarrinho, (elem, index) => { return elem.id == id })


        //Caso já exista, só altera a quantidade.
        if(existe.length > 0) {

          let objIndex = meuCarrinho.findIndex((obj => obj.id == id))
          meuCarrinho[objIndex].qntd = meuCarrinho[objIndex].qntd + qntdAtual

        }
        //Caso não exista item, adiciona ele.
        else{

          item[0].qntd = qntdAtual;
          meuCarrinho.push(item[0])
          
        }

        //Sempre que add uma quantidade o número é zerado.
        cardapio.metodos.mensagem('Item adicionado ao carrinho.', 'green')
        $("#qntd-" + id).text(0)

        cardapio.metodos.atualizarBadgeTotal();

      }

    }

  },

  //Atualizar valor total das badges (bolsa) da página inicial. "Meu carrinho"
  atualizarBadgeTotal: () => {

    let total = 0;

    $.each(meuCarrinho, (i, e) => {
      total += e.qntd
    })

    if(total > 0) {

      $(".botao-carrinho").removeClass('hidden');
      $(".container-total-carrinho").removeClass('hidden')

    }else{

      $(".botao-carrinho").addClass('hidden')
      $(".container-total-carrinho").addClass('hidden')

    }

    $(".badge-total-carrinho").html(total);

  },

  //Abrir a modal de carrinho.
  abrirCarrinho: (abrir) => {
    if (abrir) {

      $("#modalCarrinho").removeClass('hidden');
      cardapio.metodos.carregarCarrinho();

    }else{

      $("#modalCarrinho").addClass('hidden');

    }

  },

  //Altera os textos e exibe os botoes das etapas.
  carregarEtapa: (etapa) => {

    if (etapa == 1) {

      $("#lblTituloEtapa").text('Seu carrinho:');
      $("#itensCarrinho").removeClass('hidden');
      $("#localEntrega").addClass('hidden');
      $("#resumoCarrinho").addClass('hidden');

      $(".etapa").removeClass('active');
      $(".etapa1").addClass('active');

      $("#btnEtapaPedido").removeClass('hidden');
      $("#btnEtapaEndereco").addClass('hidden');
      $("#btnEtapaResumo").addClass('hidden');
      $("#btnVoltar").addClass('hidden');

    }

    if (etapa == 2) {

      $("#lblTituloEtapa").text('Endereço de entrega:');
      $("#itensCarrinho").addClass('hidden');
      $("#localEntrega").removeClass('hidden');
      $("#resumoCarrinho").addClass('hidden');

      $(".etapa").removeClass('active');
      $(".etapa1").addClass('active');
      $(".etapa2").addClass('active');

      $("#btnEtapaPedido").addClass('hidden');
      $("#btnEtapaEndereco").removeClass('hidden');
      $("#btnEtapaResumo").addClass('hidden');
      $("#btnVoltar").removeClass('hidden');

    }

    if (etapa == 3) {

      $("#lblTituloEtapa").text('Resumo do pedido:');
      $("#itensCarrinho").addClass('hidden');
      $("#localEntrega").addClass('hidden');
      $("#resumoCarrinho").removeClass('hidden');

      $(".etapa").removeClass('active');
      $(".etapa1").addClass('active');
      $(".etapa2").addClass('active');
      $(".etapa3").addClass('active');

      $("#btnEtapaPedido").addClass('hidden');
      $("#btnEtapaEndereco").addClass('hidden');
      $("#btnEtapaResumo").removeClass('hidden');
      $("#btnVoltar").removeClass('hidden');

    }


  },

  //Botao de voltar oltar uma etapa.
  voltarEtapa: () => {

    let etapa = $(".etapa.active").length;
    cardapio.metodos.carregarEtapa(etapa - 1);

  },

  //Carrega lista de itens do carrinho.
  carregarCarrinho: () => {

    cardapio.metodos.carregarEtapa(1);

    if (meuCarrinho.length > 0) {

      $("#itensCarrinho").html('');

      $.each(meuCarrinho, (i, e) => {
        //.replace mesma regra tem no código acima.
        let temp = cardapio.templates.itemCarrinho
          .replace(/\${img}/g, e.img)
          .replace(/\${name}/g, e.name)
          .replace(/\${price}/g, e.price.toFixed(2).replace('.', ','))
          .replace(/\${id}/g, e.id)
          .replace(/\${qntd}/g, e.qntd)

          $("#itensCarrinho").append(temp);

          //Ultimo item do carrinho
          if ((i + 1) == meuCarrinho) {

            cardapio.metodos.carregaValores();

          }
          

      })

    } else {

      //Essa estilização está na pasta "modal.css" => <p class="carrinho-vazio"><i class="fa fa-shopping-bag"></i>Seu carrinho está vazio</p>
      $("#itensCarrinho").html('<p class="carrinho-vazio"><i class="fa fa-shopping-bag"></i>Seu carrinho está vazio</p>');
      cardapio.metodos.carregaValores();

    }

  },

  //Diminuir quantidade do item no carrinho.
  diminuirQuantidadeCarrinho: (id) => {

    let qntdAtual = parseInt($("#qntd-carrinho-" + id).text());

    if(qntdAtual > 1) {

      $("#qntd-carrinho-" + id).text(qntdAtual - 1);
      cardapio.metodos.atualizarCarrinho(id, qntdAtual - 1);

    } else {

      cardapio.metodos.removerItemCarrinho(id);

    }

  },

  //Aumentar quantidade do item no carrinho.
  aumentarQuantidadeCarrinho: (id) => {

    let qntdAtual = parseInt($("#qntd-carrinho-" + id).text());
    $("#qntd-carrinho-" + id).text(qntdAtual + 1);
    cardapio.metodos.atualizarCarrinho(id, qntdAtual + 1);

  },

  //Botao de fechar na tela de itens do carrinho.
  removerItemCarrinho: (id) => {

    meuCarrinho = $.grep(meuCarrinho, (e, i) => { return e.id != id });
        cardapio.metodos.carregarCarrinho();

        // atualiza o botão carrinho com a quantidade atualizada
        cardapio.metodos.atualizarBadgeTotal();

  },

  //Atualiza o carrinho com a quantidade atual.
  atualizarCarrinho: (id, qntd) => {

    let objIndex = meuCarrinho.findIndex((obj => obj.id == id));
    meuCarrinho[objIndex].qntd = qntd;

    //Atualiza o botão carrinho com a quantidade atualizada.
    cardapio.metodos.atualizarBadgeTotal();

    //Atualiza os valores em reais totais do carrinho.
    cardapio.metodos.carregaValores();

  },

  //Carrega valores de Subtotal, entrega e total.
  carregaValores: () => {

    valorCarrinho = 0;

    $("#lblSubTotal").text('R$ 0,00')
    $("#lblValorEntega").text('+ R$ 0,00')
    $("#lblValorTotal").text('R$ 0,00')

    $.each(meuCarrinho, (i, e) => {

      valorCarrinho += parseFloat(e.price * e.qntd);

      if ((i + 1) == meuCarrinho.length) {
        
        $("#lblSubTotal").text(`R$ ${valorCarrinho.toFixed(2).replace('.', ',')}`);
        $("#lblValorEntega").text(`+ R$ ${valorEntrega.toFixed(2).replace('.', ',')}`);
        $("#lblValorTotal").text(`R$ ${(valorCarrinho + valorEntrega).toFixed(2).replace('.', ',')}`);

      }

    })

  },

  //Carregar a etapa endereços.
  carregarEndereco: () => {

    if(meuCarrinho.length <= 0) {

      cardapio.metodos.mensagem('Seu carrinho está vazio.')
      return;
    
    }

    cardapio.metodos.carregarEtapa(2);

  },

  //API via CEP
  buscarCEP: () => {

    //Cria a variável com o valor do CEP.
    let cep = $("#txtCEP").val().trim().replace(/D/g, '');

    //Verifica se o CEP possui valor informado.
    if(cep != ""){

      //Expressão regular para validar CEP.
      let validaCep = /^[0-9]{8}$/;

      if(validaCep.test(cep)) {

          $.getJSON("https://viacep.com.br/ws/" + cep + "/json/?callback=?", function (dados) {

            if (!("erro" in dados)) {

              //Atualizar os campos com os valores retornados.
              $("#txtEndereco").val(dados.logradouro);
              $("#txtBairro").val(dados.bairro);
              $("#txtCidade").val(dados.localidade);
              $("#dd1Uf").val(dados.uf);
              $("#txtNumero").focus();
              //$("#txtComplemento").focus();

            } else {

              cardapio.metodos.mensagem('CEP não encontrado. Preencha as informações manualmente.');
              $("#txtEndereco").focus();

            }

          })

      } else {

          cardapio.metodos.mensagem('O formato do CEP inválido.');
          $("#txtCEP").focus();

      }

    } else {

      cardapio.metodos.mensagem('Informe o CEP por favor!')
      $("#txtCEP").focus();

    }

  },

  // Validação antes de prosseguir para a etapa 3.
  resumoPedido: () => {

    let cep = $("#txtCEP").val().trim();
    let endereco = $("#txtEndereco").val().trim();
    let bairro = $("#txtBairro").val().trim();
    let cidade = $("#txtCidade").val().trim();
    let uf = $("#ddlUf").val().trim();
    let numero = $("#txtNumero").val().trim();
    let complemento = $("#txtComplemento").val().trim();

    if (cep.length <= 0) {
        cardapio.metodos.mensagem('Informe o CEP, por favor.');
        $("#txtCEP").focus();
        return;
    }

    if (endereco.length <= 0) {
        cardapio.metodos.mensagem('Informe o Endereço, por favor.');
        $("#txtEndereco").focus();
        return;
    }

    if (bairro.length <= 0) {
        cardapio.metodos.mensagem('Informe o Bairro, por favor.');
        $("#txtBairro").focus();
        return;
    }

    if (cidade.length <= 0) {
        cardapio.metodos.mensagem('Informe a Cidade, por favor.');
        $("#txtCidade").focus();
        return;
    }

    if (uf == "-1") {
        cardapio.metodos.mensagem('Informe a UF, por favor.');
        $("#ddlUf").focus();
        return;
    }

    if (numero.length <= 0) {
        cardapio.metodos.mensagem('Informe o Número, por favor.');
        $("#txtNumero").focus();
        return;
    }

    if (complemento.length <= 0) {
      cardapio.metodos.mensagem('Informe um Complemento, por favor.');
      $("#txtComplemento").focus();
      return;
  }

    meuCarrinho = {
        cep: cep,
        endereco: endereco,
        bairro: bairro,
        cidade: cidade,
        uf: uf,
        numero: numero,
        complemento: complemento
    }

    cardapio.metodos.carregarEtapa(3);
    cardapio.metodos.carregarResumo();

},

  //Mensagens
  mensagem: (texto, cor = 'red', tempo = 2500) => {
  
    let id = Math.floor(Date.now() * Math.random()).toString();
    
    let msg = `<div id="msg-${id}" class="animated fadeInDown toast ${cor}">${texto}</div>`;
    
    $("#container-mensagens").append(msg);
    
    setTimeout(() => {
      $("#msg-" + id).removeClass('fadeInDown');
      $("#msg-" + id).addClass('fadeOutUp');
      setTimeout(() => {
        $("#msg-" + id).remove();
      }, 800)
    }, tempo)
  }

 

}

//Templates que vão ser gerados a partir do JS.
cardapio.templates = {
    //Template do produto.
    item: `
        <div class="col-3 mb-3">
            <div class="card card-item" id="\${id}">
                <div class="img-produto">
                    <img src="\${img}" alt="Imagem">
                    <p class="title-produto text-center mt-4">
                        <b>\${name}</b>
                    </p>
                    <p class="price-produto text-center">
                        <b>R$ \${price}</b>
                    </p>
                    <div class="add-carrinho">
                        <span class="btn-menos" onclick="cardapio.metodos.diminuirQuantidade('\${id}')"><i class="fas fa-minus"></i></span>
                        <span class="add-numero-itens" id="qntd-\${id}">0</span>
                        <span class="btn-mais" onclick="cardapio.metodos.aumentarQuantidade('\${id}')"><i class="fas fa-plus"></i></span>
                        <span class="btn btn-add" onclick="cardapio.metodos.adicionarAoCarrinho('\${id}')"><i class="fas fa-shopping-bag"></i></span>
                    </div>
                </div>
            </div>
        </div>
    `,

    //Template do item do carrinho.
    itemCarrinho: `
        <div class="col-12 item-carrinho">
        <div class="img-produto">
            <img src="\${img}" alt="#">
        </div>
        <div class="dados-produto">
            <p class="title-produto"><b>\${name}</b></p>
            <p class="price-produto"><b>R$ \${price}</b></p>
        </div>
        <div class="add-carrinho">
            <span class="btn-menos" onclick="cardapio.metodos.diminuirQuantidadeCarrinho('\${id}')"><i class="fas fa-minus"></i></span>
            <span class="add-numero-itens" id="qntd-carrinho-\${id}">\${qntd}</span>
            <span class="btn-mais" onclick="cardapio.metodos.aumentarQuantidadeCarrinho('\${id}')"><i class="fas fa-plus"></i></span>
            <span class="btn btn-remove" onclick="cardapio.metodos.removerItemCarrinho('\${id}')"><i class="fas fa-times"></i></span>
        </div>
        </div>
    `

};
