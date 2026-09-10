# Vindima RS

Experiência de portfólio de enoturismo da Serra Gaúcha. HTML, CSS e JavaScript sem etapa de build, seguindo a estrutura estática do Dev Showcase.

## Executar

Na raiz do repositório: `python -m http.server 8080`. Abra `/previews/vindima-rs/`. O GitHub Pages serve os mesmos arquivos diretamente.

## Recursos

- Cena de vinho fixada durante parte da rolagem: preenchimento da taça, narrativa em três etapas e controles clicáveis equivalentes.
- Inclinação da taça ao mover o mouse, botão para girar, brilho e profundidade nos cartões, parallax da imagem inicial e revelação de seções ao entrar na tela.
- Duas imagens autorais e um vídeo MP4 de oito segundos com movimento de câmera, armazenados em `assets/`. [Origem e prompts](assets/PROVENANCE.md).
- Vídeo sem som, com pausa explícita e pausa automática fora da tela. Movimento reduzido desativa animações e reprodução automática. Em telas baixas a cena deixa de ficar fixa.

- Seis experiências fictícias, três cidades, categorias, busca sem distinção de acentos e ordenação por preço.
- Detalhes em diálogos acessíveis, reserva simulada com validação de data e participantes, cálculo de preços.
- Roteiro de um a três dias, persistência local, remoção, atribuição de dias e exportação em texto.
- Português e espanhol, mapa regional esquemático, guia sazonal e link para o turismo oficial.
- Layout responsivo, navegação por teclado, estados de foco e respeito a movimento reduzido.

## Limites deliberados

Todos os produtos e preços são fictícios. Não há reservas reais, pagamentos, coleta de dados pessoais, backend ou área administrativa. O mapa é esquemático, sem escala, e não oferece navegação. O roteiro é salvo apenas no navegador usado. Não há contas nem sincronização entre dispositivos.

Fotografias ilustrativas carregadas de images.unsplash.com e fontes Playfair Display / DM Sans do Google Fonts dependem de internet. As imagens não representam os destinos ou prestadores específicos. Não há afirmação de parceria com estabelecimentos reais.

## Direção visual

UI/UX Pro Max foi consultada para tipografia, contraste, hierarquia e comportamento. A busca complementar de estilo orientou uma composição editorial; não foi adotado o efeito Liquid Glass sugerido pela busca inicial por não se adequar ao produto. Verde profundo, papel claro, serifa expressiva, imagens grandes e transições discretas. CSS nativo atende às animações necessárias sem adicionar React/Motion a um repositório estático.
