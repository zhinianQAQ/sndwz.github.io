var useRandomOrgApi = false;

// 获取0-1之间的实数
function getRandom(useRandomOrg)
{
    var randReal = 0;
    if (useRandomOrg)
    {
        var randInteger = 0;
        var randMax = 999999999;
        $.ajax({
            type: "GET",
            url: "https://www.random.org/integers/?num=1&min=0&max=999999999&col=1&base=10&format=plain&rnd=new",
            dataType: "text",
            async: false,
            success: function(data, textStatus){
                randInteger = parseInt(data);
            }
        });
        randReal = randInteger / randMax;
    }
    else
    {
        randReal = Math.random();
    }
    return randReal;
}

function summonFromPool(upcards, nmcards, type, rank, rand)
{
    var card = new Object();
    card.type = type;
    card.rank = rank;
    card.id = null;

    if (rand < 0)
    {
        rand = getRandom(useRandomOrgApi);
    }

    var counter = 0;
    for (var i=0; i<upcards.length; i++)
    {
        var upcard_info = upcards[i];
        counter += upcard_info.rate;
        if (rand < counter)
        {
            card.id = upcard_info.id;
            break;
        }
    }

    if (card.id == null)
    {
        card.id = nmcards[Math.floor(getRandom(useRandomOrgApi)*nmcards.length)];
    }

    return card;
}

function summon(pool)
{
    var rand = getRandom(useRandomOrgApi);
    var card = new Object();
    if (rand >= 0.98)
    {
        // SSR servant 2%
        var r = (rand - 0.98) / 0.02;
        var upcards = pool.servant_ssr_up;
        var nmcards = pool.servant_ssr;
        card = summonFromPool(upcards, nmcards, "servant", 5, r);
    }
    else if (rand >= 0.88 && rand < 0.98)
    {
        // SSR Craft Essence 10%
        var r = (rand - 0.88) / 0.10;
        var upcards = pool.craft_essence_ssr_up;
        var nmcards = pool.craft_essence_ssr;
        card = summonFromPool(upcards, nmcards, "craft_essence", 5, r);
    }
    else if (rand >= 0.84 && rand < 0.88)
    {
        // SR servant 4%
        var r = (rand - 0.95) / 0.04;
        var upcards = pool.servant_sr_up;
        var nmcards = pool.servant_sr;
        card = summonFromPool(upcards, nmcards, "servant", 4, r);
    }
    else if (rand >= 0.64 && rand < 0.84)
    {
        // SR Craft Essence 20%
        var r = (rand - 0.64) / 0.20;
        var upcards = pool.craft_essence_sr_up;
        var nmcards = pool.craft_essence_sr;
        card = summonFromPool(upcards, nmcards, "craft_essence", 4, r);
    }
    else if (rand >= 0.5334&& rand < 0.64)
    {
        // R servant 10.66%
        var r = (rand - 0.5334) / 0.1066;
        var upcards = pool.servant_r_up;
        var nmcards = pool.servant_r;
        card = summonFromPool(upcards, nmcards, "servant", 3, r);
    }
    else
    {
        // R Craft Essence 53.34%
        var r = rand / 0.5334;
        var upcards = pool.craft_essence_r_up;
        var nmcards = pool.craft_essence_r;
        card = summonFromPool(upcards, nmcards, "craft_essence", 3, r);
    }
    return card;
}

// 抽取保底金卡
function summmonGolden(pool)
{
    var rand = getRandom(useRandomOrgApi);
    var card = new Object();

    if (rand >= 0.98)
    {
        // SSR servant 1 (2%)
        var r = (rand - 0.98) / 0.02;
        var upcards = pool.servant_ssr_up;
        var nmcards = pool.servant_ssr;
        card = summonFromPool(upcards, nmcards, "servant", 5, r);
    }
    else if (rand >= 0.88 && rand < 0.98)
    {
        // SSR Craft Essence 4 (10%)
        var r = (rand - 0.88) / 0.1;
        var upcards = pool.craft_essence_ssr_up;
        var nmcards = pool.craft_essence_ssr;
        card = summonFromPool(upcards, nmcards, "craft_essence", 5, r);
    }
    else if (rand >= 0.84 && rand < 0.88)
    {
        // SR servant 3 (4%)
        var r = (rand - 0.84) / 0.04;
        var upcards = pool.servant_sr_up;
        var nmcards = pool.servant_sr;
        card = summonFromPool(upcards, nmcards, "servant", 4, r);
    }
    else
    {
        // SR Craft Essence 12 (84%)
        var r = rand / 0.84;
        var upcards = pool.craft_essence_sr_up;
        var nmcards = pool.craft_essence_sr;
        card = summonFromPool(upcards, nmcards, "craft_essence", 4, r);
    }

    return card;
}

// 保底衣服
/*
function summmonServants(pool)
{
    var rand = getRandom(useRandomOrgApi);

    var card = new Object();

    // SSR 5
    var ssr_rate = 2.0 /100;
    var ssr_threshold = 1 - ssr_rate;
    // SR 95
    var sr_rate = 98 /100;
    var sr_threshold = ssr_threshold - sr_rate;
    

    if (rand >= ssr_threshold)
    {
        // SSR
        var r = (rand - ssr_threshold) / ssr_rate;
        var upcards = pool.servant_ssr_up;
        var nmcards = pool.servant_ssr;
        card = summonFromPool(upcards, nmcards, "servant", 5, r);
    }
  
    else
    {
        // SR 
        var r = rand / sr_rate;
        var upcards = pool.servant_sr_up;
        var nmcards = pool.servant_sr;
        card = summonFromPool(upcards, nmcards, "servant", 4, r);
    }

    return card;
}*/

//稀有度
function statRankOfCards(cards, rank)
{
    var counter = 0;
    for (var i=0; i<cards.length; i++)
    {
        var card = cards[i];
        if (card.rank == rank)
        {
            counter++;
        }
    }
    return counter;
}

//部位
function statTypeOfCards(cards, type)
{
    var counter = 0;
    for (var i=0; i<cards.length; i++)
    {
        var card = cards[i];
        if (card.type == type)
        {
            counter++;
        }
    }
    return counter;
}

function shuffle(cards)
{
    var shuffled = new Array();
    while(cards.length > 0)
    {
        var index = parseInt(Math.random() * cards.length);
        shuffled.push(cards[index]);
        cards.splice(index, 1);
    }
    return shuffled;
}


//保底机制为十连必出sr衣服以上
function summon10combo(pool)
{
    var cards = new Array();

    // 前9张卡正常抽
    for (var i=0; i<8; i++)
    {
        var card = summon(pool);
        cards.push(card);
    }

    // 如果前8张卡全是R，第9张从sr ssr中抽
    if (statRankOfCards(cards, 3) == 8)
    {
        var card = summmonGolden(pool);
        cards.push(card);
    }
    else
    {
        var card = summon(pool);
        cards.push(card);
    }

    // 如果前9张卡全是配饰，第10张卡从衣服池中抽
    if (statTypeOfCards(cards, 'craft_essence') == 9)
    {
        var card = summmonGolden(pool);
        cards.push(card);
    }
    else
    {
        var card = summon(pool);
        cards.push(card);
    }

    return shuffle(cards);
}

//获取鼠标坐标
function mousePosition(ev){ 
    ev = ev || window.event; 
    if(ev.pageX || ev.pageY){ 
        return {x:ev.pageX, y:ev.pageY}; 
    } 
    return { 
        x:ev.clientX + document.body.scrollLeft - document.body.clientLeft, 
        y:ev.clientY + document.body.scrollTop - document.body.clientTop 
    }; 
}