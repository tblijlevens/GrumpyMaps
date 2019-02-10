import { Selector } from 'testcafe';

fixture `Getting Started`
    .page `http://www.umanise.nl/grumpymaps/`;

test('creating a player', async t => {
    await t
        .click('#squarecontainer84');
        let addObstruct = await Selector('.addObstruct');
        addObstruct = await Selector('.addObstruct');
    await t
        .click('.addObstruct')
        .click('#pills-create-player-tab')
        .pressKey('tab tab tab tab M a n d y space I s space D a space B o m b')
        .pressKey('tab tab tab tab tab tab tab enter')
        let playerName = (await Selector('.playerNameMap').innerText).trim();
        console.log("///////////////////////////////////////////////////////////////////////////");
        console.log("///////////////////////////////////////////////////////////////////////////");
        console.log("The player is created and got the name: " + playerName);
        console.log("///////////////////////////////////////////////////////////////////////////");
        console.log("///////////////////////////////////////////////////////////////////////////");

        await t
        .expect(playerName).eql('Mandy Is Da Bomb');
});
