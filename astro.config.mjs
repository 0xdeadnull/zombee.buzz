// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'Zombee.Buzz',
            pagination: false,
            tableOfContents: false,
            customCss: ['./src/styles/custom.css',],
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/0xdeadnull' }],
            components: {
                Sidebar: './src/components/EmptySidebar.astro',
                PageTitle: './src/components/PageTitle.astro',
            },
		}),
	],
});
