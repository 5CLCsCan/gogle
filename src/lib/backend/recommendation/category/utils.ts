export class Ultils {
    static getCurrentTimePeriod() {
        const currentHour = new Date().getHours();
        if (currentHour >= 6 && currentHour < 15) {
            return 'morning';
        } else if (currentHour >= 15 && currentHour < 18) {
            return 'afternoon';
        } else if (currentHour >= 18 && currentHour < 22) {
            return 'night';
        } else {
            return 'lateNight';
        }
    }
    
    static getNumberOfPeople(num: number) {
        if (num < 5) return 'smallGroup';
        if (num < 10) return 'mediumGroup';
        return 'largeGroup';
    }
}

export const placeCategory: string[] = [
    'food/sang-trong', 'food/buffet', 'food/nha-hang', 'food/an-chay', 'food/quan-an', 'food/quan-nhau', 'food/food-court', 
    'food/an-vat-via-he', 'food/tiem-banh', 'food/bar-pub', 'food/beer-club', 'food/cafe', 
    'travel/Khu-du-lich', 'travel/cong-vien-vui-choi', 'travel/bao-tang-di-tich', 
    'entertain/karaoke', 'entertain/billiards', 'entertain/giai-tri', 'entertain/san-khau', 'entertain/khu-choi-game', 'shop/trung-tam-thuong-mai'
];

export const getMainCategory: { [key: string]: string } = {
    'food/sang-trong': 'feast',
    'food/buffet': 'feast',
    'food/nha-hang': 'feast',
    'food/an-chay': 'feast',
    'food/quan-an': 'feast',
    'food/quan-nhau': 'feast',
    'food/food-court': 'feast',
    'food/an-vat-via-he': 'snack',
    'food/tiem-banh': 'snack',
    'food/bar-pub': 'drink',
    'food/beer-club': 'drink',
    'food/cafe': 'drink',
    'travel/Khu-du-lich': 'explore',
    'travel/cong-vien-vui-choi': 'explore',
    'travel/bao-tang-di-tich': 'explore',
    'entertain/karaoke': 'entertain',
    'entertain/billiards': 'entertain',
    'entertain/giai-tri': 'entertain',
    'entertain/san-khau': 'entertain',
    'entertain/khu-choi-game': 'entertain',
    'shop/trung-tam-thuong-mai': 'entertain',
    'nha-sach-thu-vien': 'entertain'
};

export class HumanStatus {
    satiation: number;
    thirsty: number;
    tiredness: number;
    constructor(satiation: number, thirsty: number, tiredness: number) {
        this.satiation = satiation;
        this.thirsty = thirsty;
        this.tiredness = tiredness;
    }
}

export const categoryEvaluate: { [key: string]: HumanStatus } = {
    "feast": new HumanStatus(0.8, 0, -0.5),
    "snack": new HumanStatus(0.6, 0, -0.3),
    "drink": new HumanStatus(0, 0.8, 0),
    "explore": new HumanStatus(-0.5, -0.2, 0.7),
    "entertain": new HumanStatus(-0.5, -0.2, 0.5)
};

export const timePeriods = {
    "morning": ['food/bar-pub', 'food/beer-club', 'food/quan-nhau', 'entertain/karaoke'],
    "afternoon": ['travel/Khu-du-lich', 'food/bar-pub', 'food/beer-club', 'food/quan-nhau'],
    "night": ['travel/Khu-du-lich', 'travel/cong-vien-vui-choi', 'travel/bao-tang-di-tich', 'nha-sach-thu-vien'],
    "lateNight": []
};
