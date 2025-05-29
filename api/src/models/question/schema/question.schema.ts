import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type QuestionDocument = HydratedDocument<Question>;

@Schema({ timestamps: true })
export class Question {
    @Prop({ type: Types.ObjectId, ref: 'Lecture', required: true })
    lectureId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    createdById: Types.ObjectId;

    @Prop({ required: true })
    question: string;

    @Prop({ required: true })
    optionA: string;

    @Prop({ required: true })
    optionB: string;

    @Prop({ required: true })
    optionC: string;

    @Prop({ required: true })
    optionD: string;

    @Prop({ required: true })
    correctAnswer: string;

    @Prop()
    explanation?: string;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
