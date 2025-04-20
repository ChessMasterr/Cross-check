export default function UserReducer(state, action) {
	switch (action.type) {
		// Основные действия для авторизации
		case 'SET_USER':
			return {
				...state, // Сохраняем текущее состояние
				user: action.payload.user, // Устанавливаем данные пользователя
				isAuthenticated: true, // Устанавливаем флаг авторизации
				loading: false, // Снимаем флаг загрузки
				error: null, // Очищаем ошибки
			}

		case 'CLEAR_USER':
			return {
				user: null,
				isAuthenticated: false,
				loading: false,
				error: null,
			}

		// Действия для регистрации
		case 'REGISTER_START':
			return {
				...state,
				loading: true,
				error: null,
			}

		case 'REGISTER_SUCCESS':
			return {
				...state,
				loading: false,
				error: null,
			}

		case 'REGISTER_FAILURE':
			return {
				...state,
				loading: false,
				error: action.payload,
			}

		// Действия для авторизации
		case 'AUTH_START':
			return {
				...state,
				loading: true,
				error: null,
			}

		case 'AUTH_FAILURE':
			return {
				...state,
				loading: false,
				error: action.payload, // Сохраняем сообщение об ошибке
			}

		default:
			return state
	}
}
