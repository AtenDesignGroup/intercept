<?php

namespace Drupal\intercept_room_reservation\Field\Computed;

use Drupal\Core\Entity\EntityInterface;

trait ItemTraverseTrait {

  protected function computeValue() {
    if (!$fields = $this->getSetting('target_fields')) {
      return FALSE;
    }
    if ($target_entity = $this->traverse($this->getEntity(), $fields)) {
      $this->setValue($target_entity->id());
    }
  }

  private function traverse(EntityInterface $entity, array $fields) {
    $field = array_shift($fields);
    if ($entity->{$field} && $entity->{$field}->entity) {
      return empty($fields) ? $entity->{$field}->entity : $this->traverse($entity->{$field}->entity, $fields);
    }
    return FALSE;
  }

}
