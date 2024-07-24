import { Injectable } from '@nestjs/common';

@Injectable()
export class ShareService {
    APIFeatures(query) {
        
        const fields = query.fields ? query.fields.split(',') : [];

        const sortArray = query.sort ? query.sort.split(',') : [];
        const sortObject = sortArray.reduce((acc, sortField) => {
            const direction = sortField.startsWith('-') ? 'desc' : 'asc';
            const fieldName = sortField.startsWith('-') ? sortField.substring(1) : sortField;

            acc[fieldName] = direction;
            return acc;
        }, {});

        return { ...query, fields, sort: sortObject };
    }
}
