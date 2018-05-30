<?php

namespace Drupal\intercept_event\Controller;

use Drupal\Core\Access\AccessResult;
use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Entity\EntityFormBuilderInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Form\FormBuilderInterface;
use Drupal\Core\Url;
use Drupal\node\NodeInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Class EventsController.
 */
class EventsController extends ControllerBase {
  /**
   * @var EntityTypeManagerInterface
   */
  protected $entityTypeManager;

  /**
   * @var EntityFormBuilderInterface
   */
  protected $entityFormBuilder;

  /**
   * @var FormBuilderInterface
   */
  protected $formBuilder;

  /**
   * EventsController constructor.
   *
   * @param EntityTypeManagerInterface $entity_type_manager
   * @param EntityFormBuilderInterface $entity_form_builder
   * @param FormBuilderInterface $form_builder
   */
  public function __construct(EntityTypeManagerInterface $entity_type_manager, EntityFormBuilderInterface $entity_form_builder, FormBuilderInterface $form_builder) {
    $this->entityTypeManager = $entity_type_manager;
    $this->entityFormBuilder = $entity_form_builder;
    $this->formBuilder = $form_builder;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('entity_type.manager'),
      $container->get('entity.form_builder'),
      $container->get('form_builder')
    );
  }

  /**
   * List.
   *
   * @return string
   *   Return a render array containing the events list block.
   */
  public function list() {
    $build = [];
    $build['#attached']['library'][] = 'intercept_event/eventList';
    $build['#markup'] = '';
    $build['intercept_event_list']['#markup'] = '<div id="eventListRoot" />';

    return $build;
  }

  /**
   * Check bundle access and permissions.
   */
  public function registrationsAccess(NodeInterface $node) {
    $has_permission = $this->currentUser()->hasPermission('administer event_registration');
    return AccessResult::allowedIf($this->isEventBundle($node) && $has_permission);
  }

  /**
   * Check bundle access and permissions.
   */
  public function attendanceAccess(NodeInterface $node) {
    $has_permission = $this->currentUser()->hasPermission('administer event_attendance');
    return AccessResult::allowedIf($this->isEventBundle($node) && $has_permission);
  }

  private function isEventBundle(NodeInterface $node) {
    return $node->bundle() == 'event';
  }

  protected function getListBuilder($entity_type_id, NodeInterface $node = NULL) {
    $list_builder = \Drupal::service('entity_type.manager')->getHandler($entity_type_id, 'list_builder');
    if ($node) {
      $list_builder->setEvent($node);
    }
    return $list_builder;
  }

  public function registrations(NodeInterface $node) {
    $build = [
      'details' => [],
    ];
    $properties = $node->registration->getItemDefinition()->getSetting('properties');
    $field = $node->registration;
    foreach ($properties as $name => $property) {
      $build['details'][$name] = [
        '#type' => 'item',
        '#title' => $property->getLabel(),
        '#markup' => $field->{$name},
      ];
    }
    $build['list'] = $this->getListBuilder('event_registration', $node)->render();
    return $build;
  }

  public function attendance(NodeInterface $node) {
    $build = [];
    $build['list'] = $this->getListBuilder('event_attendance', $node)->render();
    return $build;
  }

  public function analysis(NodeInterface $node) {
    return [
      '#theme' => 'event_analysis',
      '#content' => [
        'block_1' => [
          '#markup' => 'analysis page block 1',
        ],
        'block_2' => [
          '#markup' => 'analysis page block 2',
        ],
        'block_3' => [
          '#markup' => 'analysis page block 3',
        ],
      ],
    ];
  }

}
