class APIFeatures {
    numPage = 1;
    numItem = 2;
    query;
    constructor (model,requestQuery) {
        this.model = model;
        this.requestQuery = requestQuery;
        this.schemaPath = Object.keys(model.schema.paths);
    }
    filter () {
        let filterQuery = {...this.requestQuery};
        console.log (filterQuery);
        Object.keys(this.requestQuery).forEach (el => {
            if (!this.schemaPath.includes (el)) delete filterQuery[el];
        });
        filterQuery = JSON.parse (JSON.stringify (filterQuery).replace (/\b(gte|gt|lte|lt)\b/g,(match) => `$${match}`));
        console.log (filterQuery);
        this.query = this.model.find (filterQuery);
        return this;
    }
    sort () {
        this.query = this.query.sort (this.requestQuery.sort?.replace (","," ") ?? "");
        return this;
    }

    fields () {
        this.query = this.query.select (this.requestQuery.fields?.replace (","," ") ?? "-__v");
        return this;
    }

    async pagination () {
        const skipPage = (+this.requestQuery.page || this.numPage) - 1;
        const pageLimit = +this.requestQuery.limit ?? this.numItem;
        const skipItem = skipPage * pageLimit;

        if (this.requestQuery.page) {
            const numTours = (await this.model.find ({})).length;
            if (skipItem >= numTours) throw new Error ("Page does not exist");
            this.query = this.query.skip (skipItem).limit (pageLimit);
        };
        return this;
    }
}

exports.APIFeatures = APIFeatures;