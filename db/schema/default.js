var mongoose = require('mongoose');

var SchemaObject = {

    resources: {
        food: {
            '0-40': {
                type: Number,
                default: 0
            },
            '40-55': {
                type: Number,
                default: 2
            },
            '56-65': {
                type: Number,
                default: 3
            },
            '65-80': {
                type: Number,
                default: 4
            },
            '81-89': {
                type: Number,
                default: 5
            },
            '90-100': {
                type: Number,
                default: 8
            }
        },
        raw: {
            '0-40': {
                type: Number,
                default: 0
            },
            '40-55': {
                type: Number,
                default: 2
            },
            '56-65': {
                type: Number,
                default: 3
            },
            '65-80': {
                type: Number,
                default: 4
            },
            '81-89': {
                type: Number,
                default: 5
            },
            '90-100': {
                type: Number,
                default: 8
            }
        },

        water: {
            '0-40': {
                type: Number,
                default: 0
            },
            '40-55': {
                type: Number,
                default: 1
            },
            '56-65': {
                type: Number,
                default: 2
            },
            '65-80': {
                type: Number,
                default: 3
            },
            '81-89': {
                type: Number,
                default: 4
            },
            '90-100': {
                type: Number,
                default: 6
            }
        },

        fuel: {
            '0-40': {
                type: Number,
                default: 0
            },
            '40-55': {
                type: Number,
                default: 1
            },
            '56-65': {
                type: Number,
                default: 2
            },
            '65-80': {
                type: Number,
                default: 3
            },
            '81-89': {
                type: Number,
                default: 4
            },
            '90-100': {
                type: Number,
                default: 6
            }
        },

        exotic: {
            '0-40': {
                type: Number,
                default: 0
            },
            '40-60': {
                type: Number,
                default: 1
            },
            '61-70': {
                type: Number,
                default: 2
            },
            '71-80': {
                type: Number,
                default: 3
            },
            '81-89': {
                type: Number,
                default: 4
            },
            '90-100': {
                type: Number,
                default: 6
            }
        }
    },

    construction: {
        speed: {
            type: Number,
            default: 5
        },
        cost: {
            food: {
                type: Number,
                default: 0
            },
            water: {
                type: Number,
                default: 0
            },
            fuel: {
                type: Number,
                default: 1
            },
            raw: {
                type: Number,
                default: 4
            },
            exotic: {
                type: Number,
                default: 2
            },
        }
    }



};

var SchemaOptions = {
    toObject: {
        virtuals: true,
    },
    toJSON: {
        virtuals: true,
    }
};


exports.init = function(db) {
    var Schema = new mongoose.Schema(SchemaObject, SchemaOptions);
    Schema.method.findNum = function(target, value, cd) {
        this.findOne({}, function(err, result) {
            if (err) return cd(false, err);
            var type = result.resources[target];
            if (type == 'exotic') {
                if (value > 0 && value <= 40) {
                    return cd(true, type['0-40']);
                } else if (value > 40 && value <= 60) {
                    return cd(true, type['40-60']);
                } else if (value > 60 && value <= 70) {
                    return cd(true, type['61-70']);
                } else if (value > 70 && value <= 80) {
                    return cd(true, type['71-80']);
                } else if (value > 80 && value <= 89) {
                    return cd(true, type['81-89']);
                } else if (value > 89 && value <= 100) {
                    return cd(true, type['90-100']);
                } else {
                    return cd(false, err)
                }
            } else {

                if (value > 0 && value <= 40) {
                    return cd(true, type['0-40']);
                } else if (value > 40 && value <= 55) {
                    return cd(true, type['40-55']);
                } else if (value > 55 && value <= 65) {
                    return cd(true, type['55-65']);
                } else if (value > 65 && value <= 80) {
                    return cd(true, type['65-80']);
                } else if (value > 80 && value <= 89) {
                    return cd(true, type['80-89']);
                } else if (value > 89 && value <= 100) {
                    return cd(true, type['90-100']);
                } else {
                    return cd(false, err)
                }


            }

        });
    }
    exports.default = db.model('DefaultModel', Schema);
    exports.exportedFields = ['default'];
};
