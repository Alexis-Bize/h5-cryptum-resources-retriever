# [Halo 5] Cryptum - Resources Retriever

[![N|Solid](http://i.imgur.com/5nHw7xr.png)](https://www.twitter.com/_SuckMyLuck)
### What is this?
**Resources Retriever** allows you to retrieve and save any variants to your own profile, including Warzone ones.

### How-to use
ES6:
```javascript
import ResourcesRetriever from 'h5-cryptum-resources-retriever'

const { MAP_VARIANT, GAME_VARIANT } = ResourcesRetriever.getAllowedFileTypes();
const { PLAYER, SYSTEM } = ResourcesRetriever.getAllowedOwnerTypes();

// Retrieve a map variant from the content-hacs API
// Summit (Warzone Assault)

ResourcesRetriever
.setGamertag('...')
.setSpartanToken('...') 
.setFileId('27199f2a47084284a733a2cc223559dc')
.setFileType(MAP_VARIANT)
.setOwnerType(SYSTEM)
.retrieveAndSave((err, result) => console.log(err, result));

// Retrieve a game variant from a player
// No Weapon Start

ResourcesRetriever
.setGamertag('...')
.setSpartanToken('...')
.setFileId('b768f833-878b-4e15-96e3-8e84675b553c')
.setFileType(GAME_VARIANT)
.setOwnerType(PLAYER)
.setOwnerName('X3CXeX v3') // File's owner
.retrieveAndSave((err, result) => console.log(err, result));

```

ES5:
```javascript
var ResourcesRetriever = require('h5-cryptum-resources-retriever').default;

var allowedFileTypes = ResourcesRetriever.getAllowedFileTypes();
var allowedOwnerTypes = ResourcesRetriever.getAllowedOwnerTypes();

// Retrieve a map variant from the content-hacs API
// Dispatch (Warzone Assault)

ResourcesRetriever
.setGamertag('...')
.setSpartanToken('...') 
.setFileId('026064ad62bc4f30892ab69fa76ed331')
.setFileType(allowedFileTypes.MAP_VARIANT)
.setOwnerType(allowedOwnerTypes.SYSTEM)
.retrieveAndSave(function(err, result) {
	return console.log(err, result);
});

// Retrieve a game variant from a player
// Weapons Damage Disabled

ResourcesRetriever
.setGamertag('...')
.setSpartanToken('...')
.setFileId('9b16f28b-f26d-494d-9dac-3378c84bcd01')
.setFileType(allowedFileTypes.GAME_VARIANT)
.setOwnerType(allowedOwnerTypes.PLAYER)
.setOwnerName('X3CXeX v3') // File's owner
.retrieveAndSave(function(err, result) {
	return console.log(err, result);
});

```

Note: Dashes in the **File Id** are optional.

### What is my Spartan Token?
Right now, the quicker way to retrieve your Spartan Token (Authorization) is to go to the [Halo4Stats](https://halo4stats.halowaypoint.com/oauth/spartanToken) website. A generator will be released on my [GitHub](https://github.com/Alexis-Bize/h5-cryptum-spartantoken-generator) as soon as possible.

### And what about the File Id?
Everything you need might be found on the [content-hacs API](https://content-hacs.svc.halowaypoint.com/contents/GameVariantDefinition) (See: "[Identity](https://content-hacs.svc.halowaypoint.com/content/guid-27199f2a-4708-4284-a733-a2cc223559dc)" key). Also each player's file has its own id and can be located in its sharing URL after the hash key (#). Example: [https://...#ugc...66681a69-8096-42c5-8df1-a89b21974cf1](https://www.halowaypoint.com/en-us/games/halo-5-guardians/xbox-one/game-variants?lastModifiedFilter=Everything&sortOrder=BookmarkCount&page=1&gamertag=X3CXeX%20v3#ugc_halo-5-guardians_xbox-one_gamevariant_X3CXeX%20v3_66681a69-8096-42c5-8df1-a89b21974cf1).

### Want to contribute?
Feel free to open a pull request on [GitHub](https://github.com/Alexis-Bize/h5-cryptum-resources-retriever)!

### Licence
MIT