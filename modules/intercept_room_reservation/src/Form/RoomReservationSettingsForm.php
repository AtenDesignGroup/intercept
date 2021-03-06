<?php

namespace Drupal\intercept_room_reservation\Form;

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Class RoomReservationSettingsForm.
 *
 * @ingroup intercept_room_reservation
 */
class RoomReservationSettingsForm extends ConfigFormBase {

  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames() {
    return ['intercept_core.room_reservations'];
  }

  /**
   * Returns a unique string identifying the form.
   *
   * @return string
   *   The unique string identifying the form.
   */
  public function getFormId() {
    return 'room_reservation_settings';
  }

  /**
   * Defines the settings form for Room reservation entities.
   *
   * @param array $form
   *   An associative array containing the structure of the form.
   * @param \Drupal\Core\Form\FormStateInterface $form_state
   *   The current state of the form.
   *
   * @return array
   *   Form definition array.
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $form = parent::buildForm($form, $form_state);
    $config = $this->config('intercept_core.room_reservations');
    $form['reservation_limit'] = [
      '#title' => $this->t('Room reservation limit'),
      '#type' => 'number',
      '#default_value' => $config->get('reservation_limit'),
    ];
    $form['email'] = [
      '#type' => 'vertical_tabs',
      '#title' => $this->t('Emails'),
      '#tree' => TRUE,
    ];

    $emails = [
      'reservation_accepted' => $this->t('Reservation accepted (by staff)'),
      'reservation_rejected' => $this->t('Reservation rejected (by staff)'),
      'reservation_canceled' => $this->t('Reservation canceled (by staff)'),
    ];

    foreach ($emails as $key => $title) {
      $form[$key] = [
        '#type' => 'details',
        '#title' => $title,
        '#group' => 'email',
        '#tree' => TRUE,
      ];
      $form[$key]['subject'] = [
        '#type' => 'textfield',
        '#title' => $this->t('Subject'),
        '#default_value' => $this->getSubject($key),
        '#maxlength' => 180,
      ];
      $form[$key]['body'] = [
        '#type' => 'textarea',
        '#title' => $this->t('Body'),
        '#default_value' => $this->getBody($key),
        '#rows' => 15,
      ];
    }
    return $form;
  }

  private function getEmailConfig($key) {
    return $this->config('intercept_core.room_reservations')->get("email.$key");
  }

  private function getSubject($key) {
    return !empty($this->getEmailConfig($key)) ? $this->getEmailConfig($key)['subject'] : '';
  }

  private function getBody($key) {
    return !empty($this->getEmailConfig($key)) ? $this->getEmailConfig($key)['body'] : '';
  }

  /**
   * Form submission handler.
   *
   * @param array $form
   *   An associative array containing the structure of the form.
   * @param \Drupal\Core\Form\FormStateInterface $form_state
   *   The current state of the form.
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $config = $this->config('intercept_core.room_reservations');
    $values = $form_state->cleanValues()->getValues();
    foreach ($values as $key => $info) {
      if (!empty($info["{$key}__active_tab"])) {
        continue;
      }
      $key = !empty($form[$key]['#group']) ? $form[$key]['#group'] . ".{$key}" : $key;
      $config->set($key, $info);
    }
    $config->save();
    parent::submitForm($form, $form_state);
  }

}
