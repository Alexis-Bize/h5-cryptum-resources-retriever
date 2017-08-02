import request from 'request'
import { v4 } from 'uuid'

class ResourcesRetriever
{
    static fileTypes = {
        GAME_VARIANT: 2,
        MAP_VARIANT: 3
    }

    static ownerTypes =  {
        PLAYER: 1,
        SYSTEM: 3
    }

    constructor() {
        this.fileId = '';
        this.fileType = null;
        this.ownerName = '';
        this.ownerType = null;
        this.gamertag = '';
        this.spartanToken = null;
        this.telemetrySessionId = null;
    }

    getFileId = () => this.fileId
    getFileType = () => this.fileType
    getOwnerName = () => this.ownerName
    getOwnerType = () => this.ownerType

    getAllowedFileTypes = () => ResourcesRetriever.fileTypes
    getAllowedOwnerTypes = () => ResourcesRetriever.ownerTypes

    getGamertag = () => this.gamertag
    getSpartanToken = () => this.spartanToken
    getTelemetrySessionId = () => this.telemetrySessionId

    setFileId = (uuid = '') => {
        this.fileId = uuid.replace(/-/g, '');
        return this;
    }

    setFileType = (type = null) => {
        this.fileType = type;
        return this;
    }

    setOwnerName = (name = '') => {
        this.ownerName = name;
        return this;
    }

    setOwnerType = (type = null) => {
        this.ownerType = type;
        return this;
    }

    setGamertag = (gamertag = '') => {
        this.gamertag = encodeURIComponent(gamertag);
        return this;
    }

    setSpartanToken = (spartanToken = null) => {
        this.spartanToken = spartanToken;
        return this;
    }

    setTelemetrySessionId = (uuid = null) => {
        this.telemetrySessionId = uuid;
        return this;
    }

    retrieveAndSave = (cb = () => {}) => {

        try {

            this.validateMandatoryParameters();

            const requestHeaders = {
                'Accept-Encoding': 'gzip',
                '343-Telemetry-Session-Id': this.getTelemetrySessionId() || v4(),
                'X-343-Authorization-Spartan': this.getSpartanToken(),
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=utf-8',
                'User-Agent': 'cpprestsdk/2.4.0 (Cryptum: Resources Retriever; h5-cryptum-resources-retriever)'
            };
            
            request({
                uri: [
                    'https://ugc.svc.halowaypoint.com/h5/players',
                    `${this.getGamertag()}`,
                    `${this.fileTypeToSection(this.getFileType())}`,
                    'actions/copy'
                ].join('/'),
                method: 'POST',
                gzip: true,
                headers: requestHeaders,
                json: {
                    SourceFile: {
                        ResourceId: this.getFileId(),
                        ResourceType: this.getFileType(),
                        Owner: this.getOwnerName(),
                        OwnerType: this.getOwnerType()
                    }
                }
            }, (err, response, body) => {

                if (err || response.statusCode !== 202) {
                    return cb(err || new Error(
                        `Something went wrong... - Status code: ${response.statusCode}`
                    ));
                }

                request({
                    uri: [
                        'https://ugc.svc.halowaypoint.com/h5/players',
                        `${this.getGamertag()}`,
                        `${this.fileTypeToSection(this.getFileType())}`,
                        `${body.Identity.ResourceId}`
                    ].join('/'),
                    method: 'PATCH',
                    gzip: true,
                    headers: requestHeaders,
                    json: { Tags: ['cryptum'] }
                }, (err, response, body) => cb(err, body));

            });

        } catch (err) {
            return cb(err);
        }

    }

    fileTypeToSection = fileType => {
        return {
            [ResourcesRetriever.fileTypes.MAP_VARIANT]: 'MapVariants',
            [ResourcesRetriever.fileTypes.GAME_VARIANT]: 'GameVariants'
        }[fileType];
    }

    validateMandatoryParameters = () => {

        if (null === this.getSpartanToken()) {
            throw new Error('Missing mandatory "spartanToken" parameter');
        }

        if (this.getGamertag().length === 0) {
            throw new Error('Missing mandatory "gamertag" parameter');
        }

        if (false === /^([a-zA-Z]{1})([a-zA-Z0-9 ]{0,14})$/.test(decodeURIComponent(this.getGamertag()))) {
            throw new Error('Malformated "gamertag" parameter');
        }

        if (this.getFileId().length === 0) {
            throw new Error('Missing mandatory "fileId" parameter');
        }

        if (false === /^([a-z0-9]{8})([a-z0-9]{4})([a-z0-9]{4})([a-z0-9]{4})([a-z0-9]{12})$/.test(this.getFileId())) {
            throw new Error('Malformated "fileId" parameter');
        }

        if (null === this.getFileType()) {
            throw new Error('Missing mandatory "fileType" parameter');
        }
        
        if (Object.keys(ResourcesRetriever.fileTypes).some(fileType => {
            return ResourcesRetriever.fileTypes[fileType] === this.getFileType();
        }).length === 0) throw new Error('Specified "fileType" parameter is not supported');

        if (null === this.getOwnerType()) {
            throw new Error('Missing mandatory "ownerType" parameter');
        }

        if (Object.keys(ResourcesRetriever.ownerTypes).some(ownerType => {
            return ResourcesRetriever.ownerTypes[ownerType] === this.getOwnerType();
        }).length === 0) throw new Error('Specified "ownerType" parameter is not supported');

        if (ResourcesRetriever.ownerTypes.SYSTEM === this.getOwnerType() && this.getOwnerName().length !== 0) {
            throw new Error('Specified "ownerType" parameter does not allow an "ownerName"');
        } else if (ResourcesRetriever.ownerTypes.USER === this.getOwnerType()) {
            if (this.getOwnerName().length === 0) {
                throw new Error('Missing mandatory "ownerName" parameter');
            } else if (false === /^([a-zA-Z]{1})([a-zA-Z0-9 ]{0,14})$/.test(this.getOwnerName())) {
                throw new Error('Malformated "ownerName" parameter');
            }
        }

    }
}

export default (new ResourcesRetriever())