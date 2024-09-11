import React from 'react';
import { StyleSheet } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';

import AppHeader from '../components/AppHeader';
import colors from '../config/colors';
import AppButton from '../components/AppButton';
import Screen from '../components/Screen';
import AppTextInput from '../components/AppTextInput';
import AppText from '../components/AppText';
import { fetchSendFeedback } from '../functions/apiUsers';
import { createOkAlert } from '../functions/alerts';
import { navigationRef } from '../navigationService';

const validationSchema = Yup.object().shape({
  feedback: Yup.string()
    .min(5, 'Feedback must be at least 5 characters long')
    .max(500, 'Feedback cannot be more than 500 characters')
    .required('Feedback is required'),
});

function FeedbackScreen({ route }) {
	const { email } = route.params;

	const handleFeedbackSubmit = async (values) => {
		const data = await fetchSendFeedback(email, values.feedback)
		if (data && 'error' in data) {
			createOkAlert(data.error)
		} else {
			navigationRef.navigate('Home')
			createOkAlert('Thank you for your feedback!')
		}
	}

  	return (
		<Screen style={styles.screen}>
			<AppHeader title='Feedback' />
			<Formik
				initialValues={{ feedback: '' }}
				onSubmit={(values) => handleFeedbackSubmit(values)}
				validationSchema={validationSchema}
			>
			{({ handleChange, handleSubmit, errors, touched, setFieldTouched, values }) => (
				<>
					<AppTextInput
						placeholder="Your feedback"
						style={styles.textInput}
						value={values.feedback}
						onChangeText={handleChange('feedback')}
						onBlur={() => setFieldTouched('feedback')}
						multiline={true}
					/>
					{touched.feedback && errors.feedback && (
						<AppText style={styles.errorText}>{errors.feedback}</AppText>
					)}
					<AppButton title='Submit' onPress={handleSubmit} />
				</>
			)}
		</Formik>
		</Screen>
  	);
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.background,
    paddingHorizontal: '5%',
  },
  textInput: {
    marginVertical: 18,
    height: 150, // Allow multiline input to grow
    textAlignVertical: 'top', // Ensure the text starts from the top in multiline mode
    justifyContent: 'flex-start',
    paddingTop: 10,
    marginBottom: 20
  },
  errorText: {
    color: 'red',
    fontSize: 15,
    marginBottom: 20,
  },
});

export default FeedbackScreen;
