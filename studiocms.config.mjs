import studiocmsMD from '@studiocms/md'
import { defineStudioCMSConfig } from 'studiocms/config'

export default defineStudioCMSConfig({
	dbStartPage: false,
	db: {
		dialect: 'libsql',
	},
	plugins: [studiocmsMD()],
})
