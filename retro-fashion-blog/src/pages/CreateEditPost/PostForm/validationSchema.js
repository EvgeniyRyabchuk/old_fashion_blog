import * as Yup from "yup";

const createValidationSchema = (t) => {
    return Yup.object({
        title: Yup.string().required(t("required") || "Required"),
        categoryId: Yup.string().required(t("required-category") || "Required category"),
        dateRangeStart: Yup.date().required(t("required") || "Required"),
        dateRangeEnd: Yup.date().required(t("required") || "Required"),
        tags: Yup.array().optional(),
        editor: Yup.string()
            .test('required', t("editor-content-required") || 'Editor content is required', (value) => {
                // ReactQuill often returns '<p><br></p>' or similar when empty
                // So we need to check if content is actually empty after removing HTML tags
                if (!value) return false;

                // Remove HTML tags and check if there's any meaningful content
                const plainText = value.replace(/<[^>]*>/g, '').trim();
                return plainText.length > 0;
            })
            .test('minLength', t("editor-min-length") || 'Editor content must have at least 10 characters', (value) => {
                if (!value) return false;

                // Remove HTML tags and check length of plain text
                const plainText = value.replace(/<[^>]*>/g, '').trim();
                return plainText.length >= 10;
            })
            .max(100000, t("content-too-long") || "Content is too long"),
    });
};

export default createValidationSchema;