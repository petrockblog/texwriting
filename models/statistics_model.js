var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var statisticsSchema = new Schema({
    year: Number,
    month: Number,
    counter: Number
});

statisticsSchema.statics.countUp = function() {
    var date = new Date();
    var currentYear = date.getFullYear();
    var currentMonth = date.getMonth();

    var statistics = this.findOne({
        year: currentYear,
        month: currentMonth
    }, function(err, statistics) {
        if (err) {
            console.log("Error during findOne.");
        } else {
            if (statistics) {
                statistics.counter += 1;

                statistics.save(function(err) {
                    if (err) {
                        console.log("Something went wrong.");
                    } else {
                        // console.log('Counter ' + statistics.month + '/' + statistics.year + ' updated to ' + statistics.counter);
                    }
                });
            } else {
                console.log("Created new entry");

                var newEntry = new Statistics();
                newEntry.year = currentYear;
                newEntry.month = currentMonth;
                newEntry.counter = 1;
                newEntry.save(function(err) {
                    if (err) {
                        console.log("Something went wrong during creating a new entry.");
                    } else {
                        // console.log("Successfully created new entry.");
                    }
                })

            }
        }
    });
}

statisticsSchema.statics.totalCount = function(callback) {
    this.aggregate([{
        $group: {
            _id: null,
            total: {
                $sum: "$counter"
            }
        }
    }], function(errors, result) {
        if (errors) {
            callback(-1);
        } else {
            callback(result[0].total);
        }
    });
}

// the schema is useless so far
// we need to create a model using it
var Statistics = mongoose.model('Statistics', statisticsSchema);