

export class NftToken {
    tokenId!: string;
    blockchain!: string;
    address!: string;
    name?: string;
    descripton?: string;
    imageUrl?: string;
    animationUrl?: string;
    previewLink?: string;
    collection?: Collection;
    traits!: Traits[];
    owner!: string[];
    created?: Date;
}

class Traits {
    [key: string]: string;
    value!: string;
}

class Collection {
    name!: string;
    descripton?: string;
    imageUrl?: string;
}
