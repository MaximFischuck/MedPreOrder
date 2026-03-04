<?php
/**
 * The header for our theme
 *
 * This is the template that displays all of the <head> section and everything up until <div id="content">
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package kadence
 */

namespace Kadence;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

?>
<!doctype html>
<html <?php language_attributes(); ?> class="no-js" <?php kadence()->print_microdata( 'html' ); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1">
	<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<?php
/**
 * Kadence before wrapper hook.
 */
do_action( 'kadence_before_wrapper' );
?>



   <!-- Шапка -->
<header class="site-header">
    <div class="container">
        <div class="header-content">
            <!-- Логотип -->
            <a href="index.html" class="logo">
                <div class="logo-icon">
                    <i class="fas fa-prescription-bottle-alt"></i>
                </div>
                <div class="logo-text">
                    <h1>MedPreOrder</h1>
                    <p>Аптека с доставкой</p>
                </div>
            </a>
            
            <!-- Мобильное меню (бургер) -->
            <button class="mobile-menu-toggle" aria-label="Меню">
                <span></span>
                <span></span>
                <span></span>
            </button>
            
            <!-- Навигация -->
            <nav class="main-nav">
                <ul class="nav-menu">
                    <li class="nav-item">
                        <a href="index.html" class="nav-link active">
                            <i class="fas fa-home"></i>
                            <span>Главная</span>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="catalog.html" class="nav-link">
                            <i class="fas fa-pills"></i>
                            <span>Каталог</span>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="#about" class="nav-link">
                            <i class="fas fa-info-circle"></i>
                            <span>О нас</span>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="#delivery" class="nav-link">
                            <i class="fas fa-shipping-fast"></i>
                            <span>Доставка</span>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="#contacts" class="nav-link">
                            <i class="fas fa-address-book"></i>
                            <span>Контакты</span>
                        </a>
                    </li>
                </ul>
            </nav>
            
            <!-- Корзина -->
            <div class="cart-wrapper">
                <button class="cart-button" onclick="window.location.href='cart.html'">
                    <i class="fas fa-shopping-cart"></i>
                    <span>Корзина</span>
                    <span class="cart-count" id="cart-count">0</span>
                </button>
            </div>
        </div>
    </div>
</header>
